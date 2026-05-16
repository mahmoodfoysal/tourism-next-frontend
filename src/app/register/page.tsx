"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
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

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="bg-base-100 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-base-content/5">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-base-100/80 backdrop-blur-md z-20">
          <h3 className="text-2xl font-black uppercase tracking-tight text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-8 pt-4 max-h-[60vh] overflow-y-auto custom-scrollbar text-base-content/70 leading-relaxed font-medium space-y-4">
          {children}
        </div>
        <div className="p-8 pt-4 border-t border-base-content/5 flex justify-end bg-base-200/30">
          <button
            onClick={onClose}
            className="btn btn-primary rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
      showError("Registration Failed", error);
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setWasSubmitted(true);

    if (!name || !email || !password) {
      showError(
        "Profile Incomplete",
        "Please provide your full name, email, and a secure password to initialize your premium voyage account.",
      );
      return;
    }

    showProcessing(
      "Creating Account",
      "Please wait while we set up your premium profile...",
    );
    const result = await dispatch(
      registerUser({ email, password, fullName: name }),
    );

    if (registerUser.fulfilled.match(result)) {
      closeAlert();
      showSuccess("Welcome!", "Your account has been created successfully.");
    } else if (registerUser.rejected.match(result)) {
      closeAlert();
      const errorMessage =
        (result.payload as string) ||
        "Could not create your account. Please try again.";
      showError("Registration Failed", errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    showProcessing("Connecting to Google", "Authenticating your account...");
    const result = await dispatch(loginWithGoogle());
    closeAlert();
    if (loginWithGoogle.fulfilled.match(result)) {
      showSuccess("Success!", "Signed up with Google successfully.");
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

      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-base-100 rounded-[2.5rem] shadow-2xl overflow-hidden border border-base-content/5 glass-effect">
        {/* Left Side: Branding/Image */}
        <div className="lg:w-1/2 relative hidden lg:block overflow-hidden">
          <img
            src="/login-bg.png"
            alt="Luxury Travel"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-10000 ease-linear"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="space-y-4 translate-y-0 opacity-100 transition-all duration-700 delay-300">
              <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>
              <h2 className="text-4xl font-black text-white leading-tight">
                Unlock Exclusive <br />
                <span className="text-primary italic">Travel Deals</span>
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
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 15}`}
                          alt="User"
                          className="w-full h-full object-cover"
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

        {/* Right Side: Register Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-base-content">
                Create Account
              </h1>
              <p className="text-base-content/60 font-medium">
                Start your premium travel journey today
              </p>
            </div>

            {/* Social Register */}
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
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold ml-1 text-base-content/70 flex items-center gap-1">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  className={`input input-bordered w-full h-14 rounded-2xl bg-base-200/50 border-transparent focus:border-primary focus:bg-base-100 transition-all px-6 font-medium ${wasSubmitted && !name ? "!border-error" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <label className="text-sm font-bold ml-1 text-base-content/70 flex items-center gap-1">
                  Password <span className="text-primary">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full h-14 rounded-2xl bg-base-200/50 border-transparent focus:border-primary focus:bg-base-100 transition-all px-6 font-medium ${wasSubmitted && !password ? "!border-error" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start gap-2 px-1 py-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm rounded-md mt-0.5"
                  id="terms"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium text-base-content/60 cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    Terms
                  </button>{" "}
                  &{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    Privacy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all ${loading ? "loading" : ""}`}
              >
                {loading ? "" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-base-content/60 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline transition-all"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms & Conditions"
      >
        <p className="font-bold text-base-content">
          Welcome to AuraTrip. By using our services, you agree to the following
          terms:
        </p>
        <div className="space-y-4">
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              1. User Agreement
            </h4>
            <p>
              You must be at least 18 years old to use this platform. All
              account information must be accurate and truthful.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              2. Booking Policy
            </h4>
            <p>
              All bookings are subject to availability. Prices may fluctuate
              based on seasonal demand and local provider adjustments.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              3. Cancellation
            </h4>
            <p>
              Cancellations must be made at least 72 hours before the scheduled
              departure to be eligible for a partial refund.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              4. Code of Conduct
            </h4>
            <p>
              We maintain a zero-tolerance policy for harassment or illegal
              activities during our tours.
            </p>
          </section>
        </div>
      </Modal>

      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <p className="font-bold text-base-content">
          Your privacy is our tactical priority. Here is how we handle your
          data:
        </p>
        <div className="space-y-4">
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              1. Data Collection
            </h4>
            <p>
              We collect your name, email, and travel preferences to provide a
              personalized experience.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              2. Security Measures
            </h4>
            <p>
              All data is encrypted and stored in secure cloud environments.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              3. Third-Party Sharing
            </h4>
            <p>
              We only share necessary information with our trusted travel
              partners (hotels, airlines) to facilitate your bookings.
            </p>
          </section>
          <section>
            <h4 className="font-black text-primary text-sm uppercase">
              4. Your Rights
            </h4>
            <p>
              You have the right to request access to or deletion of your
              personal data at any time via your account settings.
            </p>
          </section>
        </div>
      </Modal>
    </main>
  );
};

export default RegisterPage;
