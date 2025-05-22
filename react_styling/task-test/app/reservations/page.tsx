import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ReservationForm } from "@/components/reservation/reservation-form"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Phone } from "lucide-react"

export default function ReservationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Reserva tu Mesa</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <Card>
                <CardContent className="p-6">
                  <ReservationForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Información de Reservas</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Horarios</h3>
                      <p className="text-muted-foreground">
                        Domingo - Martes: 8:15 am - 5:00 pm
                        <br />
                        Miércoles - Sábado: 8:15 am - 10:00 pm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Contacto</h3>
                      <p className="text-muted-foreground">
                        Teléfono: 787-234-5702
                        <br />
                        Email: reservas@therapyrestaurant.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Ubicación</h3>
                      <p className="text-muted-foreground">
                        Monte Real Shopping
                        <br />
                        Carolina, Puerto Rico 00987
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30308.694602050896!2d-65.98024867431642!3d18.39583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c0368c2cc397a63%3A0x1589f1a647e0aa9e!2sCarolina%2C%20Puerto%20Rico!5e0!3m2!1sen!2sus!4v1716242462099!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Restaurant location"
                ></iframe>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Política de Reservas</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Las reservas se mantienen por 15 minutos después de la hora reservada.</li>
                  <li>Para grupos de más de 8 personas, por favor contacte directamente por teléfono.</li>
                  <li>Se requiere un depósito para reservas en días festivos y eventos especiales.</li>
                  <li>Cancelaciones con menos de 24 horas de antelación pueden estar sujetas a un cargo.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
