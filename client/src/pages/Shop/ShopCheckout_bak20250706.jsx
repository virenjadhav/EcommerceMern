import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import ShopAddress from "@/components/shop/ShopAddress";
import UserCartItemsContent from "@/components/shop/UserCartItemsContent";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "@/store/shop/shopOrdersSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // or process.env.REACT_APP_STRIPE_PUBLIC_KEY

function CheckoutForm() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  // const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  // const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  // for stripe payment
  const stripe = useStripe();
  const elements = useElements();

  console.log(currentSelectedAddress, "cartItems");

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
  const createOrder = async (confirmPaymentResponse) => {
    try {
      console.log("respnose create order", confirmPaymentResponse);
      const paymentIntentId = confirmPaymentResponse.paymentIntent.id;
      let totalAmount = 0;
      const totalPrice = cartItems.items.reduce((total, item) => {
        let price = item?.salesPrice > 0
              ? item?.salesPrice
              : item?.price;
        totalAmount += price * item.quantity;
        
        total += price;
      })
      console.log("total Price", totalPrice)
      console.log("total amount", totalAmount)
      
      const orderData = {
        paymentIntentId,
        
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
      itemsPrice: totalPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalAmount: totalAmount
      }
      console.log("order data", orderData)
      // const response = await dispatch(createNewOrder(orderData));
    } catch (error) {
      onsole.error("Error initiating payment:", error);
      toast.error(
        error?.message || "An error occurred while initiating payment."
      );
    }
  };
  const confirmPaymentOnStripe = async (intentResponse) => {
    try {
      const clientSecret = intentResponse.clientSecret;
      const paymentIntentId = intentResponse.paymentIntentId;
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.username || "User",
          },
        },
      });

      console.log("response from stripe payment confirmattion", result);
      if (result.error) {
        throw new Error(
          result.error.message || "Payment failed. Please try again."
        );
        return;
      } else {
        createOrder(result);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(
        error?.message || "An error occurred while initiating payment."
      );
    }
  };
  const handleInitiatePayment = async (event) => {
    try {
      if (cartItems.length === 0) {
        throw new Error("Your cart is empty. Please add items to proceed.");

        return;
      }
      if (currentSelectedAddress === null) {
        throw new Error("Please select one address to proceed.");

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
        confirmPaymentOnStripe(data);
      } else {
        throw new Error(data?.message || "Failed to create order.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(
        error?.message || "An error occurred while initiating payment."
      );
    }
  };

  // if (approvalURL) {
  //   window.location.href = approvalURL;
  // }

  return (
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
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <CardElement className="p-4 border border-gray-300 rounded-md" />

            <Button onClick={handleInitiatePayment} className="w-full">
              {/* {isPaymentStart ? "Processing  Payment..." : "Make Payment"} */}
              Make Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShopCheckout = ({ cartItems, userId, shippingAddress }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default ShopCheckout;
