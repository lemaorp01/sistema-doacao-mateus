import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DonationItem } from '@/lib/stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16', // Use the latest API version
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donationItem, donorInfo, campaignId } = body;

    // Validate the request
    if (!donationItem || !donationItem.amount || !donorInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: donorInfo.email,
      line_items: [
        {
          price_data: {
            currency: donationItem.currency || 'brl',
            product_data: {
              name: donationItem.name || 'Doação',
              description: donationItem.description || 'Apoio para campanha de arrecadação',
            },
            unit_amount: donationItem.amount * 100, // Stripe uses cents
          },
          quantity: donationItem.quantity || 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/campanhas`,
      metadata: {
        campaignId: campaignId || 'default',
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
      },
    });

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}