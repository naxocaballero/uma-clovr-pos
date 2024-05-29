package main

import (
	"log"
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
	Pending   TransactionStatus = "PENDIENTE"
	Paid      TransactionStatus = "PAGADO"
	Expired   TransactionStatus = "EXPIRADO"
	Refounded TransactionStatus = "DEVUELTA"
)

type Transaction struct {
	gorm.Model
	Amount       uint              `json:"amount"`
	InvoiceID    uint              `json:"invoice_id"`
	CreationDate time.Time         `json:"creation_date"`
	Status       TransactionStatus `json:"status"`
	Expiration   uint64            `json:"timeout"`
	RefoundID    uint              `json:"refound_id"`
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

func (c *Controller) createInvoice(_ *gin.Context) {
	log.Println("Solicitud para crear un invoice")
	// Crear invoice
}

func (c *Controller) payInvoice(ctx *gin.Context) {
	log.Println("Solicitud para pagar un invoice")
}

func (c *Controller) getTransactions(_ *gin.Context) {
	log.Println("Solicitud para obtener las transacciones")
	// Obtener transacciones de la BD
}
