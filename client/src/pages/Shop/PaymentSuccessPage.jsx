import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-semibold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for your purchase. A confirmation email has been sent.
      </p>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
}
