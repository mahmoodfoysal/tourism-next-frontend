"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  loginWithEmail,
  loginWithGoogle,
  setError,
} from "@/store/slices/authSlice";
import { RootState, AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import {
  showSuccess,
  showError,
  showProcessing,
  closeAlert,
} from "@/components/pages/Alert";

const LoginPage = () => {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      showError("Login Failed", error);
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setWasSubmitted(true);

    if (!email || !password) {
      showError(
        "Authentication Required",
        "Please provide your secure email and password to proceed.",
      );
      return;
    }

    showProcessing(
      "Signing In",
      "Please wait while we verify your credentials...",
    );
    const result = await dispatch(loginWithEmail({ email, password }));
    
    if (loginWithEmail.fulfilled.match(result)) {
      closeAlert();
      showSuccess("Welcome Back!", "Successfully logged in to your account.");
    } else if (loginWithEmail.rejected.match(result)) {
      closeAlert();
      const errorMessage = result.payload as string || "Invalid email or password. Please try again.";
      showError("Login Failed", errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    showProcessing("Connecting to Google", "Authenticating your account...");
    const result = await dispatch(loginWithGoogle());
    closeAlert();
    if (loginWithGoogle.fulfilled.match(result)) {
      showSuccess("Success!", "Logged in with Google successfully.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-base-200/50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-base-100 rounded-[2rem] shadow-2xl overflow-hidden border border-base-content/5 glass-effect">
        {/* Left Side: Branding/Image */}
        <div className="lg:w-1/2 relative hidden lg:block overflow-hidden">
          <Image
            src="/login-bg.png"
            alt="Luxury Travel"
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-10000 ease-linear"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="space-y-4 translate-y-0 opacity-100 transition-all duration-700 delay-300">
              <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>
              <h2 className="text-4xl font-black text-white leading-tight">
                Begin Your Next <br />
                <span className="text-primary italic">Adventure</span> With Us
              </h2>
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Join thousands of travelers who have found their perfect
                getaway. Your premium travel experience starts here.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-base-300 overflow-hidden"
                    >
                      <div className="w-10 h-10 rounded-full relative overflow-hidden">
                        <Image
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="User"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Joined by 10k+ explorers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl font-black tracking-tight">
                Welcome Back
              </h1>
              <p className="text-base-content/60 font-medium">
                Please enter your details to sign in
              </p>
            </div>

            {/* Social Login */}
            <div className="w-full">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="btn btn-outline w-full border-base-content/10 hover:bg-base-content/5 gap-3 rounded-2xl h-14 normal-case"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-content/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-base-100 px-4 text-base-content/40 font-bold">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-base-content/70 flex items-center gap-1">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  className={`input input-bordered w-full h-14 rounded-2xl bg-base-200/50 border-transparent focus:border-primary focus:bg-base-100 transition-all px-6 font-medium ${wasSubmitted && !email ? "!border-error" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold ml-1 text-base-content/70 flex items-center gap-1">
                    Password <span className="text-primary">*</span>
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-bold text-primary hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full h-14 rounded-2xl bg-base-200/50 border-transparent focus:border-primary focus:bg-base-100 transition-all px-6 font-medium ${wasSubmitted && !password ? "!border-error" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm rounded-md"
                  id="remember"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-base-content/60 cursor-pointer select-none"
                >
                  Keep me logged in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all ${loading ? "loading" : ""}`}
              >
                {loading ? "" : "Sign In to Your Account"}
              </button>
            </form>

            <p className="text-center text-base-content/60 font-medium">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-bold hover:underline transition-all"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
