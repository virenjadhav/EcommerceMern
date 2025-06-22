import CommonForm from "@/components/common/CommonForm";
import { registerControls } from "@/config";
import { registerUser } from "@/store/authSlice";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialRegisterFormData = {
  username: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialRegisterFormData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // functions
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      // .unwrap()
      .then((data) => {
        if (data?.payload?.success) {
          navigate("/auth/login");
          toast.success(data.payload?.message);
        } else {
          toast.error(data.payload?.message);
        }
      });
    // const promise = dispatch(registerUser(formData));

    // toast.promise(promise, {
    //   loading: "Registering...",
    //   success: (data) => {
    //     return `${data?.payload?.message}`;
    //   },
    //   error: (error) => {
    //     return error.message || "Registration failed";
    //   },
    // });
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerControls}
        formData={formData}
        setFormData={setFormData}
        buttonText="Register"
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthRegister;
