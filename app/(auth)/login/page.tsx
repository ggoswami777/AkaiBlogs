"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Slide, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  // variables
  const [mode, setMode] = useState("login"); // login, signup, forgot_password
  const [forgotStep, setForgotStep] = useState<"email" | "otp" | "password">("email");
  const [isGenerateOtpClicked, setIsGeneratedOtpClicked] = useState(false);
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  //toasties
  const alertFailOtp = () => {
    toast.error("Failed to send OTP", {
      transition: Slide,
    });
  };
  const alertOtpSent = () => {
    toast.success("OTP sent successfully!", {
      transition: Slide,
    });
  };
  const alertFillDetail = () => {
    toast.warn("Please fill in username, email, and password first.", {
      transition: Slide,
    });
  };
  const alertFillOtp = () => {
    toast.warn("Please enter the Otp!", {
      transition: Slide,
    });
  };
  const alertUserSuccess = () => {
    toast.success("User created successfully", {
      transition: Slide,
    });
  };
  const alertLoginSuccess = () => {
    toast.success("User Logged in successfully", {
      transition: Slide,
    });
  };
  const alertFillLogin = () => {
    toast.warn("Please fill in email, and password first.", {
      transition: Slide,
    });
  };
  const alertLoginFailed = () => {
    toast.error("Failed to Log in", {
      transition: Slide,
    });
  };

  // use effects
  useEffect(() => {
    setIsGeneratedOtpClicked(false);
    setForgotStep("email");
  }, [mode, setMode]);

  // FUNCTIONS
  const handleGenerateOtp = async () => {
    if (!email || !username || !password) {
      alertFillDetail();
      return;
    }
    setIsGeneratingOtp(true);
    setResendCooldown(30);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("OTP SENT:", data.otp);
        setIsGeneratedOtpClicked(true);
        alertOtpSent();
      } else {
        alertFailOtp();
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleSendForgotPasswordOtp = async () => {
    if (!email) {
      toast.warn("Please enter your email.", { transition: Slide });
      return;
    }
    setIsGeneratingOtp(true);
    setResendCooldown(30);
    try {
      const response = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("OTP sent to your email!", { transition: Slide });
        setForgotStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP", { transition: Slide });
      }
    } catch (error) {
      console.error("Error sending forgot password OTP:", error);
      toast.error("An error occurred. Please try again.", { transition: Slide });
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleVerifyForgotPasswordOtp = async () => {
    if (!otp) {
      toast.warn("Please enter the OTP.", { transition: Slide });
      return;
    }
    setIsGeneratingOtp(true);
    try {
      const response = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("OTP verified successfully!", { transition: Slide });
        setForgotStep("password");
        setPassword(""); // Clear password field for new password entry
      } else {
        toast.error(data.error || "Verification failed.", { transition: Slide });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.", { transition: Slide });
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 8) {
      toast.warn("Password must be at least 8 characters.", { transition: Slide });
      return;
    }
    setCreatingUser(true);
    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Password updated successfully! Please login.", { transition: Slide });
        setMode("login");
        setPassword("");
      } else {
        toast.error(data.error || "Failed to update password.", { transition: Slide });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again.", { transition: Slide });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alertFillLogin();
      return;
    }
    if (mode === "login") {
      try {
        setCreatingUser(true);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          alertLoginSuccess();
          setCreatingUser(false);
          router.push("/akaiBlogs/feed");
          console.log("token:", data.token);
        } else {
          alertLoginFailed();
          setCreatingUser(false);
        }
      } catch (error) {
        setCreatingUser(false);
        console.error("Error logging in:", error);
      }
    } else {
      if (!otp) {
        alertFillOtp();
        return;
      }
      try {
        setCreatingUser(true);
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, otp }),
        });
        const data = await response.json();
        if (data.success) {
          alertUserSuccess();
          router.push("/akaiBlogs/feed");
          console.log("token:", data.token);
        } else {
          toast.error(data.message, { transition: Slide });
        }
        setCreatingUser(false);
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  // return code
  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-screen">
      <Link href="/">
        <div className="absolute top-10 left-10 flex items-center gap-3 z-10 ">
          <div className="sm:size-10 size-8 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            AkaiBlogs
          </span>
        </div>
      </Link>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 japanese-pattern opacity-40"></div>
        <img
          className="w-full h-full object-cover filter brightness-50"
          data-alt="Cinematic dark landscape with red Japanese architecture accents"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwS3Xrrs8lEK5UFPH50pQJV5j2OFzLN47yIRAXLQW33NDeYSjWdNUJfprqK_pej-sOv9d4H90FNY2ybdGSnohFF6qXilNB14V6xfcfQU-Q5MLi5JOUjDL-3COhJ8twe9TNBN0JYITM9LklTlGSS20xtcF9kLKRyxQ7YcMjKiGPkmzmu2BBodgo8ZFUOLDJymGSvtjUXNBvwvEQ05qEh-5XKOTdmjkNM1Xvaw6Uvtmiv5BmcBRnHtkLck2KtvGPYww4u6SmTt358g"
        />
        <div className="absolute inset-0 cinematic-gradient"></div>
      </div>
      <div className="relative w-[90%] max-w-sm sm:max-w-lg m-auto py-10 z-10 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <form
          onSubmit={handleSubmit}
          className="bg-background-dark/80 backdrop-blur-xl border border-primary/10 rounded-xl p-6 shadow-2xl"
        >
          {mode === "forgot_password" ? (
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-xl font-bold text-slate-100">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                {forgotStep === "email" && "Enter your email to receive an OTP"}
                {forgotStep === "otp" && "Enter the OTP sent to your email"}
                {forgotStep === "password" && "Enter your new password"}
              </p>
            </div>
          ) : (
            <div className="flex h-10 items-center justify-center rounded-full bg-primary/10 p-1 mb-8">
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-checked:bg-primary has-checked:text-white text-slate-400 text-sm font-semibold transition-all">
                <span className="truncate">Login</span>
                <input
                  checked={mode === "login"}
                  onChange={() => {
                    setMode("login");
                  }}
                  className="hidden"
                  name="auth_mode"
                  type="radio"
                  value="Login"
                />
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-checked:bg-primary has-checked:text-white text-slate-400 text-sm font-semibold transition-all">
                <span className="truncate">Sign Up</span>
                <input
                  checked={mode === "signup"}
                  onChange={() => {
                    setMode("signup");
                  }}
                  className="hidden"
                  name="auth_mode"
                  type="radio"
                  value="Sign Up"
                />
              </label>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {mode !== "forgot_password" ? (
              <>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: mode === "signup" ? "80px" : "0px",
                    opacity: mode === "signup" ? 1 : 0,
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        placeholder="Enter your username"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="name@example.com"
                      type="email"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/80">
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot_password");
                          setForgotStep("email");
                        }}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight:
                      mode === "signup" && isGenerateOtpClicked ? "80px" : "0px",
                    opacity: mode === "signup" && isGenerateOtpClicked ? 1 : 0,
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                      OTP (One Time Password)
                    </label>
                    <div className="relative">
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        placeholder="••••••"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {forgotStep === "email" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                      Email Address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="name@example.com"
                      type="email"
                    />
                  </div>
                )}

                {forgotStep === "otp" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                      OTP (One Time Password)
                    </label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="••••••"
                      type="text"
                    />
                  </div>
                )}

                {forgotStep === "password" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                      New Password
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {mode === "forgot_password" && (
            <div className="flex flex-col gap-4 mt-8">
              {forgotStep === "email" && (
                <button
                  type="button"
                  onClick={handleSendForgotPasswordOtp}
                  disabled={isGeneratingOtp}
                  className={`w-full text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${isGeneratingOtp ? "bg-red-900" : "bg-primary hover:bg-primary/90"}`}
                >
                  {isGeneratingOtp ? (
                    <>
                      <Loader2 className="animate-spin size-4" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}

              {forgotStep === "otp" && (
                <>
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-slate-400">Haven't received OTP?</p>
                    <div className="flex items-center gap-2">
                      {resendCooldown > 0 && (
                        <span className="text-xs font-bold text-red-900">
                          {resendCooldown}s
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleSendForgotPasswordOtp}
                        disabled={isGeneratingOtp || resendCooldown > 0}
                        className={`text-xs font-bold transition-colors disabled:cursor-not-allowed ${
                          resendCooldown > 0
                            ? "text-red-900 opacity-60 cursor-not-allowed"
                            : "text-primary hover:text-primary/80"
                        }`}
                      >
                        {isGeneratingOtp ? "Resending..." : "Resend OTP"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyForgotPasswordOtp}
                    disabled={isGeneratingOtp}
                    className={`w-full text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${isGeneratingOtp ? "bg-red-900" : "bg-primary hover:bg-primary/90"}`}
                  >
                    {isGeneratingOtp ? (
                      <>
                        <Loader2 className="animate-spin size-4" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </>
              )}

              {forgotStep === "password" && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={creatingUser}
                  className={`w-full text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${creatingUser ? "bg-red-900" : "bg-primary hover:bg-primary/90"}`}
                >
                  {creatingUser ? (
                    <>
                      <Loader2 className="animate-spin size-4" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                }}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {mode === "signup" && !isGenerateOtpClicked && (
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={isGeneratingOtp}
              className={`w-full mt-8 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${isGeneratingOtp ? "bg-red-900" : "bg-primary hover:bg-primary/90"}`}
            >
              {isGeneratingOtp ? (
                <>
                  <Loader2 className="animate-spin size-4" />
                  <span>Generating OTP...</span>
                </>
              ) : (
                "Generate OTP"
              )}
            </button>
          )}

          {mode === "signup" && isGenerateOtpClicked && (
            <>
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-xs text-slate-400">Haven't received OTP?</p>
                <div className="flex items-center gap-2">
                  {resendCooldown > 0 && (
                    <span className="text-xs font-bold text-red-900">
                      {resendCooldown}s
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={isGeneratingOtp || resendCooldown > 0}
                    className={`text-xs font-bold transition-colors disabled:cursor-not-allowed ${
                      resendCooldown > 0
                        ? "text-red-900 opacity-60 cursor-not-allowed"
                        : "text-primary hover:text-primary/80"
                    }`}
                  >
                    {isGeneratingOtp ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingUser}
                className={`w-full mt-8 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${creatingUser ? "bg-red-900" : "bg-primary hover:bg-primary/90"}`}
              >
                {creatingUser ? (
                  <>
                    <Loader2 className="animate-spin size-4" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </>
          )}

          {mode === "login" && (
            <button
              type="submit"
              disabled={creatingUser}
              className={`w-full mt-8 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${creatingUser ? "bg-red-900" : "bg-primary hover:bg-primary/90"}`}
            >
              {creatingUser ? (
                <>
                  <Loader2 className="animate-spin size-4" />
                  <span>Logging In...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default Login;
