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
	"net/url"
	"strings"
)

func conectar(uri string) {
	// Crea la conexion con la URI pasada como entrada

	// Devuelve el parámetro "client" de la conexión
}

// CreateLightningClient Generates the gRPC lightning client
func CreateLightningClient(lndConnectParams LndConnectParams) (lnrpc.LightningClient, *grpc.ClientConn, error) {

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
func Parse(uri string) (LndConnectParams, error) {
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
