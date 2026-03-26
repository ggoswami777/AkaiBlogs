"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const Login = () => {
  // variables
  const [mode, setMode] = useState("login");
  const [isGenerateOtpClicked, setIsGeneratedOtpClicked] = useState(false);
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [creatingUser,setCreatingUser]=useState(false);
  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // use effects
  useEffect(() => {
    setIsGeneratedOtpClicked(false);
  }, [mode, setMode]);

  // FUNCTIONS
  const handleGenerateOtp = async () => {
    if (!email || !username || !password) {
      alert("Please fill in username, email, and password first.");
      return;
    }
    setIsGeneratingOtp(true);

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
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
    
      try {
        setCreatingUser(true);
        const response=await fetch("/api/auth/login",{
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({email,password})
        })
        const data=await response.json();
        if(data.success){
          alert("User loggedIn successfully");
          setCreatingUser(false);
        console.log("token:",data.token);
        }
      } catch (error) {
        setCreatingUser(false);
        console.error("Error logging in:", error);
      }
    } else {
    
    
      if(!otp){
        alert("Please enter the Otp!");
        return ;
      }
      try {
        setCreatingUser(true);
        const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password ,otp}),
      });
      const data = await response.json();
      if(data.success){
        alert("User created successfully");
        console.log("token:",data.token);
      }else{
        alert(data.message);
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
        <button className="z-10 absolute top-10 left-10 glass-panel text-white hover:bg-white/10 px-10 py-4 rounded-full text-lg font-extrabold transition-all">
          Home
        </button>
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
          <div className="flex flex-col gap-5">
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
                    required
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
                  required
                  className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary/80 px-1">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: (mode === "signup") && isGenerateOtpClicked ? "80px" : "0px",
                opacity: (mode === "signup") && isGenerateOtpClicked ? 1 : 0,
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
                    required
                    className="w-full pl-6 pr-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    placeholder="••••••"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          {mode === "signup" && !isGenerateOtpClicked && (
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={isGeneratingOtp}
              className={`w-full mt-8 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${isGeneratingOtp ? 'bg-red-900' : 'bg-primary hover:bg-primary/90'}`}
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
            <button
              type="submit"
              disabled={creatingUser}
              className={`w-full mt-8 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${creatingUser ? 'bg-red-900' : 'bg-primary hover:bg-primary/90'}`}
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
          )}

          {mode === "login" && (
            <button
              type="submit"
              disabled={creatingUser}
              className={`w-full mt-8 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 ${creatingUser ? 'bg-red-900' : 'bg-primary hover:bg-primary/90'}`}
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

          <div className="mt-5">
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/10"></div>
              </div>
              <span className="relative bg-background-dark/80 px-4 text-xs font-bold uppercase text-slate-600">
                Or continue with
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-primary/10 hover:bg-primary/5 transition-all text-slate-300 font-medium text-sm">
                <img
                  className="size-4"
                  data-alt="Google G logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAna0qCI-PsQ6jWjkvtgJPBUnvLRA1aBPkqSOvlgChq7LJ5WYKVslBsr8zL4mTO6Wd_aXj_fRG_CBttCIgIorpRUG0JfpcBTHkU1O9vPWVchdlJmQloYO4mrISGrKTnTKEHA7Y_YMCWFPdH85yVbS6ux9EfSOTUbsWZ_Vr9CGgzC7_Y9-EvweL_N-9fJiD1OlVrhms8YzgN64NTGAyyr-2k8rzLnKhjYDdFmWondpUvRqxra_IJ9iJmMHDofRN9_Ljpojekyi7UbQ"
                />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-primary/10 hover:bg-primary/5 transition-all text-slate-300 font-medium text-sm">
                <img
                  className="size-4 dark:invert"
                  data-alt="Apple logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6D09E3R1sHAP81kEMyoCABYjPsH9rJVBEgyhT2wDpGaQtci8dPqd3Jqt_1eJMHC8itEMrl6Upcxevjjkm8sXZVHGHw-mil853uO3IyG7C_oYabNvChYszCaa5JgG4MCBVLFjWZ2A76JkfauFFDuw-qivYl1G3shLeCZYSSeZpFdMnn0vFcN1ClpJJWON77cjvQ6ZMR_0a10wJdQDTatr2NY8DqSEFGNd82n9Gi_U_0WiXN4rZrA73W0dokgXn1rfuh0i-wMydjQ"
                />
                Apple
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
