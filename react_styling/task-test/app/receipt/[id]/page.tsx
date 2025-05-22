import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Receipt } from "@/components/receipt/receipt"
import { getOrderById } from "@/actions/order-actions"

interface ReceiptPageProps {
  params: {
    id: string
  }
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { id } = params
  const { success, order, error } = await getOrderById(id)

  if (!success || !order) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Receipt order={order} />
      </main>
      <Footer />
    </div>
  )
}
