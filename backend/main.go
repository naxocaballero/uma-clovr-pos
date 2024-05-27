package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
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
	Expiration   uint64            `json:"timeout"`
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

	paymentRequest := ctx.Param("paymentRequest")
	/* Por ahora no se le da uso a amount
	amount, err := strconv.ParseUint(ctx.Param("amount"), 10, 64)
	if err != nil {
		log.Println("Error al leer la cantidad del pago:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al leer la cantidad del pago"})
		return
	}*/
	transactionId, err := strconv.ParseUint(ctx.Param("transactionId"), 10, 32)
	if err != nil {
		log.Println("Error al leer el ID:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de transacción no válido"})
		return
	}

	//Consulto la transaccion
	var transaction Transaction
	if err := c.Database.First(&transaction, transactionId).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Println("La transaccion no existe:", err)
			ctx.JSON(http.StatusNotFound, gin.H{"error": "La transaccion no existe"}) //Devuelve un 404
		} else {
			log.Println("Error al buscar la transaccion:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar la transaccion"})
		}
		return
	}

	//Obtengo la URI del cliente desde el archivo
	uri, err := ioutil.ReadFile("uriUsuario")
	if err != nil {
		log.Println("Error al leer el archivo uriUsuario:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno"})
		return
	}

	//Realizar el pago
	err = PagarInvoice(string(uri), paymentRequest)
	if err != nil {
		log.Println("Error al pagar el invoice:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al pagar el invoice"})
		return
	}
	transaction.Status = Paid

	//Actualizo el estado de la transaccion
	c.Database.Save(&transaction)

	ctx.JSON(http.StatusOK, transaction)
}

func (c *Controller) getTransactions(_ *gin.Context) {
	log.Println("Solicitud para obtener las transacciones")
	// Obtener transacciones de la BD
}
