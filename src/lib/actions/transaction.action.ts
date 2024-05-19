"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import dbConnect from "../dbconnect";
import Transaction from "@/models/transaction.models";
import { updateCredits } from "./user.actions";
export async function CheckoutCredits(transaction: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits:transaction.credits,
      buyerId: transaction.buyerId,

    },
    mode:'payment',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/home`,
  });


  redirect(session.url!)
}

export async function createTransaction(transaction: CreateTransactionParams){
  try {
    await dbConnect()
   const  newtransaction  = await Transaction.create({
    ...transaction,buyer: transaction.buyerId
   })

   await updateCredits(transaction.buyerId,transaction.credits)

   return JSON.parse(JSON.stringify(newtransaction))
  } catch (error) {
    handleError(error)
  }
}
