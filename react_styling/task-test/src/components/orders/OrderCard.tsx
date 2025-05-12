"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orders } from "@/db/appSchema";

interface OrderCardProps {
  order: typeof orders.$inferSelect;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <TableRow>
      <TableCell>CMD-{order.order_id}</TableCell>
      <TableCell>{order.users_id}</TableCell>
      <TableCell>{new Date(order.created_at).toLocaleDateString('fr-FR')}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-sm ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status}
        </span>
      </TableCell>
      <TableCell>{order.amount.toFixed(2)}€</TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Voir les détails
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails de la commande</DialogTitle>
              <DialogDescription>
                Commande #{order.order_id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Informations client</h3>
                <p>ID: {order.users_id}</p>
              </div>
              <div>
                <h3 className="font-semibold">Statut de la commande</h3>
                <p>Statut: {order.status}</p>
                <p>Statut de paiement: {order.payment_status}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Total: {order.amount.toFixed(2)}€</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
