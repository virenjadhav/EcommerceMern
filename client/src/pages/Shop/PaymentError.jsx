import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentError() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <XCircle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-semibold mb-2">Payment Failed</h1>
      <p className="text-muted-foreground mb-6">
        Something went wrong during the payment process. Please try again.
      </p>
      <Button variant="destructive" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
}
