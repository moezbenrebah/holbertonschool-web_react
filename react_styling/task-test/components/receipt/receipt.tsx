"use client"

import { useRef } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReceiptProps {
  order: any
}

export function Receipt({ order }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = receiptRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printDocument = printWindow.document
    printDocument.write(`
      <html>
        <head>
          <title>Recibo - THERAPY Restaurant</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .receipt {
              border: 1px solid #e2e8f0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .info-section {
              max-width: 48%;
            }
            .info-title {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items th, .items td {
              border-bottom: 1px solid #e2e8f0;
              padding: 10px;
              text-align: left;
            }
            .items th {
              background-color: #f7fafc;
            }
            .totals {
              margin-left: auto;
              width: 250px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .total-row.final {
              font-weight: bold;
              border-top: 1px solid #e2e8f0;
              padding-top: 10px;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #718096;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)

    printDocument.close()
    printWindow.focus()
    printWindow.print()
  }

  const formattedDate = format(new Date(order.created_at), "PPP 'a las' p", { locale: es })
  const subtotal = order.total / 1.1
  const tax = order.total - subtotal

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success message */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p className="text-muted-foreground">
              Tu pedido ha sido recibido y está siendo procesado. A continuación puedes ver el recibo de tu compra.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-end mb-4">
                <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir Recibo
                </Button>
              </div>

              <div ref={receiptRef} className="receipt">
                <div className="header">
                  <div className="logo">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                      THERAPY RESTAURANT
                    </span>
                  </div>
                  <p>Calle Principal 123, Madrid, España</p>
                  <p>Tel: +34 912 345 678</p>
                  <p>info@therapyrestaurant.com</p>
                </div>

                <div className="info">
                  <div className="info-section">
                    <div className="info-title">Información del Pedido</div>
                    <p>Pedido #: {order.id}</p>
                    <p>Fecha: {formattedDate}</p>
                    <p>Estado: {order.status}</p>
                  </div>

                  <div className="info-section">
                    <div className="info-title">Cliente</div>
                    <p>Nombre: {order.customer_name}</p>
                    <p>Email: {order.customer_email}</p>
                    {order.customer_phone && <p>Teléfono: {order.customer_phone}</p>}
                  </div>
                </div>

                {order.special_instructions && (
                  <div className="mb-6">
                    <div className="info-title">Instrucciones Especiales</div>
                    <p>{order.special_instructions}</p>
                  </div>
                )}

                <table className="items">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Impuestos (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="total-row final">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="footer">
                  <p>¡Gracias por tu pedido!</p>
                  <p>Esperamos verte pronto de nuevo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/menu">Volver al Menú</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Ir al Inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
