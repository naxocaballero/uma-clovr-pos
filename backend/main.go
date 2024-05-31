package main

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lightningnetwork/lnd/lnrpc"
	"google.golang.org/grpc"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
	"time"
)

type Controller struct {
	Database *gorm.DB
}

type TransactionStatus string

const (
	Pending   TransactionStatus = "PENDIENTE"
	Paid      TransactionStatus = "PAGADO"
	Expired   TransactionStatus = "EXPIRADO"
	Refounded TransactionStatus = "DEVUELTA"
)

type Transaction struct {
	gorm.Model
	Amount         uint64            `json:"amount"`
	RHash          string            `json:"r_hash"`
	PaymentRequest string            `json:"payment_request"`
	CreationDate   time.Time         `json:"creation_date"`
	Status         TransactionStatus `json:"status"`
	Expiration     uint64            `json:"expiration"`
	RefoundID      uint              `json:"refound_id"`
	Description    string            `json:"memo"`
}

var (
	dbConnectionString = "host=localhost user=admin password=adminpw dbname=postgres port=5432 sslmode=disable TimeZone=Europe/Berlin"
	nodoVenta          lnrpc.LightningClient
	conn               *grpc.ClientConn
)

func main() {
	controller := Controller{}
	controller.initDatabase()

	// Inicializar nodoVenta
	var err error
	nodoVenta, conn, err = Conectar(uriVenta)
	if err != nil {
		log.Fatalf("Error %v creando el cliente del punto de venta", err)
	}
	defer conn.Close()

	router := gin.Default()

	//Setup CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	router.POST("/invoices", controller.createInvoice)
	router.POST("/pay", controller.payInvoice)
	router.GET("/transactions", controller.getTransactions)

	err = router.Run("0.0.0.0:8080")
	if err != nil {
		return
	}
}

func (c *Controller) initDatabase() {
	db, err := gorm.Open(postgres.Open(dbConnectionString), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	c.Database = db

	err = db.AutoMigrate(&Transaction{})
	if err != nil {
		return
	}
}

func (c *Controller) createInvoice(ctx *gin.Context) {
	// Recibimos el valor de la invoice por un parámetro
	// Opcionalmente, también es posible que recibamos el temporizador de la invoice a crear

	// Definimos una estructura para recibir los parámetros JSON
	type CreateInvoiceRequest struct {
		Amount      uint64 `json:"amount"`
		Expiration  uint64 `json:"expiration,omitempty"`
		Description string `json:"memo"`
	}

	var req CreateInvoiceRequest
	if err := ctx.BindJSON(&req); err != nil {
		log.Println("Error al parsear el JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	log.Println("Amount: ", req.Amount)

	// Creamos un objeto de la clase transaction inicialmente vacío
	var newTransaction Transaction

	if req.Expiration == 0 {
		// No se ha recibido ningún timeout, por lo que utilizamos el valor por defecto
		newTransaction.Expiration = 900
	} else {
		// Lo asignamos
		newTransaction.Expiration = req.Expiration
	}

	newTransaction.Amount = req.Amount
	newTransaction.Description = req.Description

	// Asignamos el tiempo de creación actual y estado pendiente de la transacción
	newTransaction.Status = Pending
	newTransaction.CreationDate = time.Now()

	// Creamos la invoice utilizando el cliente
	invoice := &lnrpc.Invoice{
		Value: int64(req.Amount),
	}

	log.Println(newTransaction)

	resp, err := nodoVenta.AddInvoice(ctx, invoice)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, nil)
	}
	newTransaction.RHash = hex.EncodeToString(resp.RHash)
	newTransaction.PaymentRequest = resp.PaymentRequest

	c.Database.Create(&newTransaction)

	respuesta := map[string]interface{}{"r_hash": newTransaction.RHash, "id": newTransaction.ID, "payment_request": newTransaction.PaymentRequest, "expiration": newTransaction.Expiration}

	ctx.JSON(http.StatusCreated, respuesta)
}

func (c *Controller) payInvoice(ctx *gin.Context) {
	log.Println("Solicitud para pagar un invoice")

	// Obtengo los parametros de la llamada
	type PayInvoiceRequest struct {
		ID             uint64 `json:"id"`
		PaymentRequest string `json:"payment_request"`
	}

	var req PayInvoiceRequest
	if err := ctx.BindJSON(&req); err != nil {
		log.Println("Error al parsear el JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Consulto la transaccion que se quiere devolver

	var transaction Transaction

	if err := c.Database.First(&transaction, req.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Println("La transaccion no existe:", err)
			ctx.JSON(http.StatusNotFound, gin.H{"error": "La transaccion no existe"}) //Devuelve un 404
		} else {
			log.Println("Error al buscar la transaccion:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar la transaccion"})
		}
		return
	}

	if transaction.Status != Paid { //Compruebo que la transaccion fue pagada
		log.Println("No se puede devolver una transaccion que no ha sido pagada")
		ctx.JSON(http.StatusNotFound, gin.H{"error": "La transacción no ha sido pagada"})
		return
	}

	// Decodificar el paymentRequest
	decodeRequest := &lnrpc.PayReqString{PayReq: req.PaymentRequest}
	decodeResponse, err := nodoVenta.DecodePayReq(context.Background(), decodeRequest)
	if err != nil {
		log.Println("Error leyendo el paymentRequest: ", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error leyendo el paymentRequest"})
		return
	}

	// Verificar que el amount en el paymentRequest es igual al original
	if uint64(decodeResponse.NumSatoshis) != transaction.Amount {
		log.Println(fmt.Sprintf("La cantidad de satoshis no coincide con la transaccion original"))
		ctx.JSON(http.StatusNotFound, gin.H{"error": "La cantidad de satoshis no coincide con la transaccion original"})
		return
	}

	// Realizar el pago
	err = PagarInvoice(req.PaymentRequest)
	if err != nil {
		log.Println("Error al pagar el invoice:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al pagar el invoice"})
		return
	}

	//Actualizo el estado de la transaccion

	transaction.Status = Refounded
	c.Database.Save(&transaction)

	//Guardo la nueva transacción en la BD

	var nuevaTransaccion Transaction
	nuevaTransaccion.Status = Paid
	nuevaTransaccion.RefoundID = transaction.ID
	nuevaTransaccion.PaymentRequest = req.PaymentRequest
	nuevaTransaccion.Description = "Devolución: " + transaction.Description
	nuevaTransaccion.CreationDate = time.Now()
	nuevaTransaccion.Amount = transaction.Amount

	c.Database.Save(&nuevaTransaccion)

	ctx.JSON(http.StatusOK, nuevaTransaccion)
}

func (c *Controller) getTransactions(ctx *gin.Context) {
	log.Println("Solicitud para obtener todas las transacciones")

	var transactions []Transaction

	if result := c.Database.Where("status = ?", Paid).Find(&transactions); result.Error != nil {
		log.Println("Error al obtener transacciones de la base de datos:", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener transacciones"})
		return
	}

	// Devuelve la lista de transacciones como una respuesta JSON
	ctx.IndentedJSON(http.StatusOK, transactions)
}
