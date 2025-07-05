import React, { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // or process.env.REACT_APP_STRIPE_PUBLIC_KEY

const CheckoutForm = ({ cartItems, userId, shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxPrice = itemsPrice * 0.1; // example 10%
  const shippingPrice = 100; // fixed shipping
  const totalAmount = itemsPrice + taxPrice + shippingPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create Payment Intent
      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          userId,
          shippingAddress,
          taxPrice,
          shippingPrice,
        }),
      });

      const data = await res.json();
      const clientSecret = data.clientSecret;

      // Step 2: Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Virendra Jadhav", // you can pull from user data
          },
        },
      });

      if (result.error) {
        setMessage(result.error.message);
        setLoading(false);
        return;
      }

      // Step 3: Confirm Payment and Create Order
      const confirmRes = await fetch("/api/orders/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: result.paymentIntent.id,
          items: cartItems,
          userId,
          shippingAddress,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalAmount,
        }),
      });

      const confirmData = await confirmRes.json();
      if (confirmData.success) {
        setMessage("🎉 Order placed successfully!");
      } else {
        setMessage("Order failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      <div className="mb-6">
        {cartItems?.map((item) => (
          <div key={item.productId} className="flex justify-between py-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between py-1">
          <span>Items Total:</span>
          <span>₹{itemsPrice}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Tax (10%):</span>
          <span>₹{taxPrice}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Shipping:</span>
          <span>₹{shippingPrice}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement className="p-4 border border-gray-300 rounded-md" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          {loading ? "Processing..." : `Pay ₹${totalAmount}`}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center text-sm text-red-600">{message}</div>
      )}
    </div>
  );
};

const ShopCheckout = ({ cartItems, userId, shippingAddress }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      cartItems={cartItems}
      userId={userId}
      shippingAddress={shippingAddress}
    />
  </Elements>
);

export default ShopCheckout;
