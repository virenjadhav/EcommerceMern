import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export default function CheckoutForm({totalCartAmount}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const frontend_url = import.meta.env.VITE_FRONTEND_URL
        const successURL = frontend_url  +  '/stripe-payment/success';
        console.log("success url" , successURL)
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url:  successURL}
            });
        if (error) {
        console.log(error);
        // navigate('/error');
        navigate("/stripe-payment/error")
        }
    } catch(error) {
        console.error("Error when confirm payment from stripe: ", error.message);
        toast("Error: ", error.message)
    }
    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: { return_url: 'http://localhost:3000/success' }
    // });
    // if (error) {
    //   console.log(error);
    //   navigate('/error');
    // }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {/* <button disabled={!stripe}>Pay</button> */}
      <div className="mt-4 w-full">
        <Button className="w-full" disabled={!stripe}>
            Pay ${totalCartAmount}
        </Button>
    </div>
    </form>
  );
}