"use server"

import { createServerSupabaseClient, createServerAdminClient } from "@/lib/supabase/server"
import type { CartItem } from "@/hooks/use-cart"

interface CustomerInfo {
  name: string
  email: string
  phone: string
  specialInstructions?: string
}

interface OrderData {
  customerInfo: CustomerInfo
  items: CartItem[]
  total: number
}

export async function submitOrder(orderData: OrderData) {
  try {
    // Use the admin client to bypass RLS
    const supabaseAdmin = createServerAdminClient()

    // Get current user if logged in
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Calculate total with tax
    const totalWithTax = orderData.total * 1.1

    // Insert order using admin client to bypass RLS
    const { data: orderInsert, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        total: totalWithTax,
        customer_name: orderData.customerInfo.name,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        special_instructions: orderData.customerInfo.specialInstructions,
        status: "pending",
      })
      .select("id")
      .single()

    if (orderError) {
      console.error("Error inserting order:", orderError)
      return { success: false, error: orderError.message }
    }

    // Get the order ID
    const orderId = orderInsert.id

    // Insert order items using admin client to bypass RLS
    const orderItems = orderData.items.map((item) => ({
      order_id: orderId,
      item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error inserting order items:", itemsError)
      return { success: false, error: itemsError.message }
    }

    return { success: true, orderId }
  } catch (error) {
    console.error("Error in submitOrder:", error)
    return { success: false, error: "Error processing order" }
  }
}

export async function getOrderById(orderId: string) {
  try {
    // Use admin client to bypass RLS for fetching order details
    const supabaseAdmin = createServerAdminClient()

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      console.error("Error fetching order:", orderError)
      return { success: false, error: orderError.message }
    }

    // Get order items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      return { success: false, error: itemsError.message }
    }

    return {
      success: true,
      order: {
        ...order,
        items,
      },
    }
  } catch (error) {
    console.error("Error in getOrderById:", error)
    return { success: false, error: "Error fetching order" }
  }
}
