// payment.go
package main

import (
	"context"
	"fmt"
	"github.com/lightningnetwork/lnd/lnrpc"
	"log"
)

func PagarInvoice(uri string, paymentRequest string, amount uint) error {

	//Establecer conexion con el nodo
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

	//Decodificar el paymentRequest
	decodeReq := &lnrpc.PayReqString{PayReq: paymentRequest}
	decodeResp, err := nodeClient.DecodePayReq(context.Background(), decodeReq)
	if err != nil {
		log.Println("Error leyendo el paymentRequest: ", err)
		return err
	}

	//Verificar que el amount en el paymentRequest es igual al amount pasado
	if decodeResp.NumSatoshis != amount {
		errMsg := fmt.Sprintf("La cantidad de satoshis no coincide con la transaccion original")
		log.Println(errMsg)
		return fmt.Errorf(errMsg)
	}

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
