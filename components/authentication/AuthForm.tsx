"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Button } from "../ui/button";
import SignupForm from "./SignupForm";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

const AuthForm = () => {
  const [mode, setMode] = useState("login");
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {mode === "reset"
            ? "reset password"
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </h1>

        <p className="text-sm text-muted-foreground capitalize">
          {mode === "reset"
            ? "Enter your email below to reset your password"
            : mode === "login"
            ? "Enter your email below to login to your account"
            : "Enter your information below to Create an account"}
        </p>
      </div>

      {mode === "login" && (
        <>
          <LoginForm />
          <div className="flex text-center justify-between w-full">
            <Button
              className="p-0"
              variant={"link"}
              onClick={() => setMode("signup")}
            >
              Need an account? Sign up
            </Button>
            <Button
              className="p-0"
              variant={"link"}
              onClick={() => setMode("reset")}
            >
              Forgot Password
            </Button>
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <SignupForm />
          <div className="flex w-full ">
            <Button
              className="w-full"
              variant={"link"}
              onClick={() => setMode("login")}
            >
              Already have an account? Login
            </Button>
          </div>
          <p className="px-8 text-sm text-center text-muted-foreground">
            By clicking Sign Up, you agree to our{" "}
            <Link href="#" className="underline hover:text-primary">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}
      {mode === "reset" && (
        <>
          <ResetPasswordForm />
          <div>
            <Button
              className="w-full"
              variant={"link"}
              onClick={() => setMode("login")}
            >
              Back to Login
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;
