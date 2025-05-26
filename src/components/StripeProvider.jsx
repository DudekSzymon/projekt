"use client"
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export function StripeProvider({ children }) {
  const [stripePromise, setStripePromise] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initStripe = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stripe/config`)
        const stripe = await loadStripe(response.data.publishable_key)
        setStripePromise(stripe)
      } catch (error) {
        console.error('Błąd ładowania Stripe:', error)
      } finally {
        setLoading(false)
      }
    }

    initStripe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Ładowanie systemu płatności...</div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400">Błąd ładowania systemu płatności</div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}
