package main

import (
	"encoding/hex"
	"log"
	"net/http"
	"strconv"
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

	router := gin.Default()

	//Setup CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	router.POST("/invoices", controller.createInvoice)
	router.POST("/pay", controller.payInvoice)
	router.GET("/transactions", controller.getTransactions)

	err := router.Run("0.0.0.0:8080")
	if err != nil {
		return
	}

	// Crear los clientes lnd
	// Para el punto de venta
	nodoVenta, conn, err = Conectar(uriVenta)
	if err != nil {
		log.Fatalf("Error %v creando el cliente del punto de venta", err)
	}
	defer conn.Close()
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
	var amount = ctx.Param("amount")
	var expiration = ctx.Param("timeout")

	// Creamos un objeto de la clase transaction inicialmente vacío
	var newTransaction Transaction

	if expiration == "" {
		// No se ha recibido ningún timeout, por lo que utilizamos el valor por defecto
		newTransaction.Expiration = 900
	} else {
		// Convertimos la cadena recibida en un float64
		timeout, err := strconv.ParseUint(expiration, 10, 64)
		if err != nil {
			log.Println("Error convirtiendo el tiempo a uint64:", err)
			return
		}
		// Lo asignamos
		newTransaction.Expiration = timeout
	}

	// Repetimos la conversión para el parámetro amount
	amountInt, err := strconv.ParseUint(amount, 10, 64)
	if err != nil {
		log.Println("Error convirtiendo la cantidad a float:", err)
		return
	}
	newTransaction.Amount = amountInt

	// Asignamos el tiempo de creación actual y estado pendiente de la transacción
	newTransaction.Status = Pending
	newTransaction.CreationDate = time.Now()

	// Creamos la invoice utilizando el cliente
	invoice := &lnrpc.Invoice{
		Value: int64(amountInt),
	}

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

	if result := c.Database.Find(&transactions); result.Error != nil {
		log.Println("Error al obtener transacciones de la base de datos:", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener transacciones"})
		return
	}

	// Devuelve la lista de transacciones como una respuesta JSON
	ctx.IndentedJSON(http.StatusOK, transactions)
}
