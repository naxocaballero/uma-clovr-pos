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
	Pending TransactionStatus = "PENDIENTE"
	Paid    TransactionStatus = "PAGADO"
	Expired TransactionStatus = "EXPIRADO"
)

type Transaction struct {
	gorm.Model
	Amount       float64           `json:"amount"`
	InvoiceID    uint              `json:"invoice_id"`
	CreationDate time.Time         `json:"creation_date"`
	Status       TransactionStatus `json:"status"`
	Timeout      time.Duration     `json:"timeout"`
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
	// Crear invoice
}

func (c *Controller) payInvoice(ctx *gin.Context) {
	log.Println("Solicitud para pagar un invoice")
	// Pagar invoice
}

func (c *Controller) getTransactions(ctx *gin.Context) {
	log.Println("Solicitud para obtener todas las transacciones")
	var transactions []Transaction
	result := c.Database.Find(&Transaction{})
	result.Scan(&transactions)

	ctx.IndentedJSON(http.StatusOK, transactions)
}
