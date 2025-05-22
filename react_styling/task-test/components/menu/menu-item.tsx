"use client"

import Image from "next/image"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface MenuItemProps {
  name: string
  description: string
  price: number
  image: string
}

export function MenuItem({ name, description, price, image }: MenuItemProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      price,
      image,
      quantity: 1,
    })

    toast({
      title: "Añadido al carrito",
      description: `${name} ha sido añadido a tu carrito.`,
    })
  }

  return (
    <div
      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full md:w-1/3 h-[200px]">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="rounded-md object-cover" />
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Añadir al carrito
            </Button>
          </div>
        )}
      </div>
      <div className="w-full md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <span className="font-bold text-green-600">${price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button onClick={handleAddToCart} variant="outline" className="md:hidden w-full">
          <Plus className="mr-2 h-4 w-4" /> Añadir al carrito
        </Button>
      </div>
    </div>
  )
}
