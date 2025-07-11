import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import ShopAddress from "@/components/shop/ShopAddress";
import UserCartItemsContent from "@/components/shop/UserCartItemsContent";
import { createNewOrder } from "@/store/shop/shopOrdersSlice";

function ShopCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();

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

  function handleInitiatePayment() {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");

      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select one address to proceed.");

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

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "sangam");
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

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
            <Button onClick={handleInitiatePayment} className="w-full">
              {isPaymentStart ? "Processing  Payment..." : "Make Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopCheckout;
