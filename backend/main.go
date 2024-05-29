package main

import (
	"encoding/hex"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lightningnetwork/lnd/lnrpc"
	"google.golang.org/grpc"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Controller struct {
	Database *gorm.DB
}

type TransactionStatus string

const (
	Pending TransactionStatus = "PENDIENTE"
	Paid    TransactionStatus = "PAGADO"
	Expired TransactionStatus = "EXPIRADO"
)

type Transaction struct {
	gorm.Model
	Amount       uint64            `json:"amount"`
	InvoiceID    string            `json:"invoice_id"`
	CreationDate time.Time         `json:"creation_date"`
	Status       TransactionStatus `json:"status"`
	Expiration   uint64            `json:"expiration"`
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

	// Setup CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	router.POST("/invoices", controller.createInvoice)
	router.POST("/pay", controller.payInvoice)
	router.GET("/transactions", controller.getTransactions)

	go func() {
		if err := router.Run("0.0.0.0:8080"); err != nil {
			log.Fatalf("Error iniciando el servidor: %v", err)
		}
	}()

	// AQUI VA EL CODIGO PARA COMPROBAR EL ESTADO DE LAS TRANSACCIONES

	// Bloquear el main thread
	select {}
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
		Amount     uint64 `json:"amount"`
		Expiration uint64 `json:"expiration,omitempty"`
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
	newTransaction.InvoiceID = hex.EncodeToString(resp.RHash)

	c.Database.Create(&newTransaction)
	ctx.JSON(http.StatusCreated, newTransaction)
}

func (c *Controller) payInvoice(ctx *gin.Context) {
	log.Println("Solicitud para pagar un invoice")
	// Pagar invoice
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
