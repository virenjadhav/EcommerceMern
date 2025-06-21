import CommonForm from "@/components/common/CommonForm";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginFormControls } from "../../config";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  // functions
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      // .unwrap()
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(data.payload?.message);
          // navigate("/");
        } else {
          toast.error(data.payload?.message);
        }
      });
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText="Login"
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
