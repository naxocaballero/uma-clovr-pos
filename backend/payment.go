// payment.go
package main

import (
	"context"
	"fmt"
	"github.com/lightningnetwork/lnd/lnrpc"
)

func PagarInvoice(paymentRequest string) error {

	// Pagar invoice
	payment := &lnrpc.SendRequest{
		PaymentRequest: paymentRequest,
	}

	response, err := nodoVenta.SendPaymentSync(context.Background(), payment)
	if err != nil {
		return err
	}

	if response.PaymentError != "" {
		return fmt.Errorf("error en el pago: %s", response.PaymentError)
	}

	fmt.Println("Successful payment")

	return nil
}
