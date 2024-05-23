package main

import (
	"context"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"github.com/lightningnetwork/lnd/lnrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"log"
	"net/url"
	"strings"
)

func Conectar(uri string) (lnrpc.LightningClient, *grpc.ClientConn, error) {
	// Crea la conexion con la URI pasada como entrada
	// Devuelve los parámetros "client" y "conn" de la conexión

	nodeParams, err := parse(uri) //Devuelve los LndConnectParams
	if err != nil {
		fmt.Println("Error parsing the URI:", err)
		return nil, nil, err
	}

	// URI's certificate isn't formated correctly for the CreateLightningClient() funtion
	formatedCert, err := formatCert(nodeParams.Cert)
	if err != nil {
		log.Println("Error formatting the certificate: ", err)
		return nil, nil, err
	}
	nodeParams.Cert = formatedCert

	nodeClient, nodeConn, err := createLightningClient(nodeParams)
	if err != nil {
		fmt.Println("Error creating Lightning client:", err)
		return nil, nil, err
	}

	/* No cerramos aquí la conexión ya que se necesita fuera del método
	defer func() {
		err := conn.Close()
		if err != nil {
			log.Println("Error closing the connection:", err)
		}
	}()
	*/

	fmt.Println("Connected Successfully")

	return nodeClient, nodeConn, nil
}

// CreateLightningClient Generates the gRPC lightning client
func createLightningClient(lndConnectParams LndConnectParams) (lnrpc.LightningClient, *grpc.ClientConn, error) {

	creds, err := generateCredentials(lndConnectParams.Cert)
	if err != nil {
		return nil, nil, err
	}

	endpoint := fmt.Sprintf("%s:%s", lndConnectParams.Host, lndConnectParams.Port)

	conn, err := getConn(endpoint, creds, lndConnectParams.Macaroon)
	if err != nil {
		return nil, nil, err
	}

	lightningClient := lnrpc.NewLightningClient(conn)

	return lightningClient, conn, nil
}

// LndConnectParams Struct and function to handle the lndconnect string
type LndConnectParams struct {
	Host     string // Hostname or IP address
	Port     string // Port number
	Cert     string // Base64 of DER-encoded TLS certificate
	Macaroon string // Hex-encoded macaroon
}

// Parse an lndconnect URI and returns the parameters
func parse(uri string) (LndConnectParams, error) {
	parsed, err := url.Parse(uri)
	if err != nil {
		return LndConnectParams{}, err
	}

	if parsed.Scheme != "lndconnect" {
		return LndConnectParams{}, fmt.Errorf("invalid scheme: %s", parsed.Scheme)
	}

	host := parsed.Hostname()
	port := parsed.Port()
	if port == "" {
		port = "10009"
	}

	cert := parsed.Query().Get("cert")

	macaroon := parsed.Query().Get("macaroon")
	decodedMacaroon, err := base64.RawURLEncoding.DecodeString(macaroon)
	if err != nil {
		return LndConnectParams{}, fmt.Errorf("error decoding macaroon: %w", err)
	}
	macaroon = hex.EncodeToString(decodedMacaroon)

	return LndConnectParams{
		Host:     host,
		Port:     port,
		Cert:     cert,
		Macaroon: macaroon,
	}, nil
}

// generateCredentials genera credenciales TLS utilizando el certificado proporcionado.
func generateCredentials(cert string) (credentials.TransportCredentials, error) {
	// Decodificar el certificado base64
	certBytes, err := base64.StdEncoding.DecodeString(strings.ReplaceAll(cert, "\n", ""))
	if err != nil {
		return nil, fmt.Errorf("error decoding certificate: %w", err)
	}

	// Crear un pool de certificados y agregar el certificado decodificado
	certPool := x509.NewCertPool()
	if !certPool.AppendCertsFromPEM(certBytes) {
		return nil, fmt.Errorf("failed to append certificate")
	}

	return credentials.NewClientTLSFromCert(certPool, ""), nil
}

// getConn establece una conexión gRPC con el endpoint dado utilizando las credenciales proporcionadas.
func getConn(endpoint string, creds credentials.TransportCredentials, macaroon string) (*grpc.ClientConn, error) {
	return grpc.Dial(endpoint, grpc.WithTransportCredentials(creds), grpc.WithPerRPCCredentials(newMacaroonCredential(macaroon)))
}

type macaroonCredential struct {
	macaroon string
}

func newMacaroonCredential(macaroon string) *macaroonCredential {
	return &macaroonCredential{macaroon: macaroon}
}

func (m *macaroonCredential) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	return map[string]string{"macaroon": m.macaroon}, nil
}

func (m *macaroonCredential) RequireTransportSecurity() bool {
	return true
}

func formatCert(hexCert string) (string, error) {
	// Decodificar el certificado de Hex a Bytes
	certBytes, err := hex.DecodeString(hexCert)
	if err != nil {
		return "", fmt.Errorf("Error decodificando la cadena hexadecimal: %v", err)
	}

	// Codificar los bytes a Base64
	certBase64 := base64.StdEncoding.EncodeToString(certBytes)

	// Añadir encabezado y pie de página del certificado PEM
	certPEM := fmt.Sprintf("-----BEGIN CERTIFICATE-----\n%s\n-----END CERTIFICATE-----", certBase64)

	// Convertir el certificado PEM a bytes y luego a Base64 para encapsulación final
	certPEMBytes := []byte(certPEM)
	finalCertBase64 := base64.StdEncoding.EncodeToString(certPEMBytes)

	return finalCertBase64, nil
}
