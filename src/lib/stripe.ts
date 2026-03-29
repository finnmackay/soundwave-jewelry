import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    })
  }
  return _stripe
}

/** @deprecated Use getStripe() instead */
export const stripe = typeof process !== 'undefined' && process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
  : (null as unknown as Stripe)

export const MATERIALS = {
  'stainless-steel': { name: 'Stainless Steel', price: 4900, currency: 'usd', description: 'Durable and hypoallergenic' },
  'sterling-silver': { name: 'Sterling Silver', price: 7900, currency: 'usd', description: 'Classic precious metal' },
  'brass': { name: 'Brass', price: 5900, currency: 'usd', description: 'Warm vintage finish' },
  'bronze': { name: 'Bronze', price: 6900, currency: 'usd', description: 'Rich earthy tones' },
} as const

export type MaterialKey = keyof typeof MATERIALS
