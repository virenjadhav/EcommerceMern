import img from "../../assets/account.jpg";
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/shop/ShopCheckoutForm';
import ShopAddress from '@/components/shop/ShopAddress';
import { useSelector } from 'react-redux';
import UserCartItemsContent from '@/components/shop/UserCartItemsContent';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { createPaymentIntent } from "@/store/shop/shopOrdersSlice";
import { useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";


// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function ShopCheckout() {
  const [clientSecret, setClientSecret] = useState('');
  const [addressId, setAddressId] = useState('');
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salesPrice > 0
              ? currentItem?.salesPrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

    const handleInitiatePayment = async () => {
        try{
            if (cartItems.length === 0) {
                throw new Error("Your cart is empty. Please add items to proceed.")
                return;
            }
            if (currentSelectedAddress === null) {
                throw new Error("Please select one address to proceed.")
                return;
            }
            console.log("cartItems", cartItems);
            const orderData = {
                items: cartItems.items.map((singleCartItem) => ({
                productId: singleCartItem?.productId,
                name: singleCartItem?.name,
                image: singleCartItem?.image,
                price:
                    singleCartItem?.salesPrice > 0
                    ? singleCartItem?.salesPrice
                    : singleCartItem?.price,
                quantity: singleCartItem?.quantity,
                })),
                shippingAddress: {
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                postalCode: currentSelectedAddress?.pincode,
                country: currentSelectedAddress?.country,
                },
                userId: user?.id,
                taxPrice: 0,
                shippingPrice: 0,
            };
            console.log("data", orderData);

            const intentResponse = await dispatch(createPaymentIntent(orderData));
            const data = intentResponse?.payload;
            console.log("response intent ", data);
            if (data?.success) {
                setClientSecret(data?.clientSecret);
            } else {
                throw new Error(data?.message || "Failed to create payment Intent.");
            } 
        } catch (error){
            console.error("Error : ", error.message);
            toast("Error : " + error.message)
        }
    }

//   useEffect(() => {
//     // async function fetchSecret() {
//     //   const res = await fetch('http://localhost:5000/api/checkout', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ cartItems, addressId, userId })
//     //   });
//     //   const data = await res.json();
//     //   setClientSecret(data.clientSecret);
//     // }
//     // if (addressId) fetchSecret();
//   }, [addressId]);
//   const addresses = [
//     {
//         _id: "685a8efcf93fe3656278f914",
//         userId:"681b08e95463756b8641d153",
//         address:"Address1",
//         city:"city1",
//         pincode:"123456",
//         phone:"900900099",
//         notes:"mera addresss",
//     }
//   ]

  return (
    <>
     {/* <div>
      <select onChange={e => setAddressId(e.target.value)}>
        <option value=''>Select Address</option> 
         {addresses.map(addr => (
          <option key={addr._id} value={addr._id}>{addr.address}, {addr.city}</option>
        ))}
        
      </select>
      {clientSecret && (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )} 


    </div> */}
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <ShopAddress
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <Separator />
          {clientSecret ? (<div>
            <div className="mt-4 w-full font-bold text-center p-1">
                Choose Payment Method
                </div>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm totalCartAmount={totalCartAmount}/>
        </Elements>
        </div>
      ) : (<div>
      <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
      <div className="mt-4 w-full">
            <Button onClick={handleInitiatePayment} className="w-full">
              {/* {isPaymentStart
                ? "Processing Paypal Payment..." */}
                {/* : "Checkout with Paypal"} */}
                Make Payment
            </Button>
          </div>
          </div>)} 

          
        </div>
      </div>
    </div>
    </>
  );
}
export default ShopCheckout;