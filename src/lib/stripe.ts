import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';
// Load Stripe on the client side
let stripePromise: Promise<StripeJS | null>;
export const getStripe = () => {
  if (!stripePromise) {
    // Replace with your actual Stripe publishable key
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');
  }
  return stripePromise;
};
// Define the donation item type
export type DonationItem = {
  amount: number;
  currency: string;
  name: string;
  description: string;
  quantity: number;
};
// Define the checkout session type
export type CheckoutSession = {
  id: string;
  url: string;
};
// Define the PIX payment type
export type PixPayment = {
  qrCodeImage: string;
  qrCodeText: string;
  expiresAt: string;
  paymentId: string;
};