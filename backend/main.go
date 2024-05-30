package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Controller struct {
	Database *gorm.DB
}

type TransactionStatus string

const (
	Pending  TransactionStatus = "PENDIENTE"
	Paid     TransactionStatus = "PAGADO"
	Expired  TransactionStatus = "EXPIRADO"
	Refunded TransactionStatus = "DEVUELTA"
)

type Transaction struct {
	gorm.Model
	Amount       uint              `json:"amount"`
	InvoiceID    uint              `json:"invoice_id"`
	CreationDate time.Time         `json:"creation_date"`
	Status       TransactionStatus `json:"status"`
	Expiration   uint64            `json:"timeout"`
	RefundId     uint              `json:"refund_id"`
	Description  string            `json:"memo"`
}

var (
	dbConnectionString = "host=localhost user=admin password=adminpw dbname=postgres port=5432 sslmode=disable TimeZone=Europe/Berlin"
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
	router.GET("/transaction", controller.getTransaction)
	router.GET("/list", controller.getList)

	err := router.Run("0.0.0.0:8080")
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
	log.Println("Solicitud para crear un invoice")
}

func (c *Controller) payInvoice(ctx *gin.Context) {
	log.Println("Solicitud para pagar un invoice")
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

func (c *Controller) getTransaction(ctx *gin.Context) {
	log.Println("Solicitud para la transacción indicada")

	type transactionRequest struct {
		ID int `json:"id"`
	}

	var data transactionRequest
	if err := ctx.BindJSON(&data); err != nil {
		log.Println("Error al parsear el JSON:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid request"})
		return
	}

	var transaction Transaction
	if result := c.Database.Where("id = ?", data.ID).First(&transaction); result.Error != nil {
		log.Println("Error al obtener la transacción de la base de datos:", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener transacción"})
		return
	}

	// Devuelve la transacción como una respuesta JSON
	ctx.IndentedJSON(http.StatusOK, transaction)
}

func (c *Controller) getList(ctx *gin.Context) {
	type transactionsListRequest struct {
		ID              int `json:"id"`
		NumeroRegistros int `json:"numero_registros"`
	}

	var data transactionsListRequest
	if err := ctx.BindJSON(&data); err != nil {
		log.Println("Error al parsear el JSON:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid request"})
		return
	}

	// Lista de transacciones a devolver que cumplan los requisitos
	var transactions []Transaction
	if result := c.Database.Where("id >= ?", data.ID).Order("id ASC").Limit(data.NumeroRegistros).Find(&transactions); result.Error != nil {
		log.Println("Error al obtener transacciones de la base de datos:", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener transacciones"})
		return
	}

	// Devuelve la lista de transacciones como una respuesta JSON
	ctx.IndentedJSON(http.StatusOK, transactions)
}
