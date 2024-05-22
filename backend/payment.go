// payment.go
package main

import (
	"context"
	"fmt"
	"github.com/lightningnetwork/lnd/lnrpc"
	"log"
)

func PagarInvoice(uri string, paymentRequest string) error {

	// Establecer conexion con el nodo
	nodeClient, nodeConn, err := Conectar(uri)
	if err != nil {
		log.Println("Failed to connect with the node: ", err)
		return err
	}

	defer func() {
		err := nodeConn.Close()
		if err != nil {
			log.Println("Error closing the connection:", err)
		}
	}()

	// Pagar invoice
	payment := &lnrpc.SendRequest{
		PaymentRequest: paymentRequest,
	}

	response, err := nodeClient.SendPaymentSync(context.Background(), payment)
	if err != nil {
		return err
	}

	if response.PaymentError != "" {
		return fmt.Errorf("error en el pago: %s", response.PaymentError)
	}

	fmt.Println("Successful payment")

	return nil
}
