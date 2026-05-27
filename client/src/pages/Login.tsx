/* eslint-disable @typescript-eslint/no-unused-vars */
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState("login");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, signup, user } = useAppContext();

  const handleSubmit = async(e: React.SubmitEvent) =>{
    e.preventDefault()
    setIsSubmitting(true);
    if(state === 'login'){
      await login({email, password})
    } else {
      await signup({username, email, password})
    }
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <main className="login-page-container">
        <form
          aria-label={`${state === "login" ? "Sign in form" : "Sign up form"}`}
          className="login-form"
          action=""
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
            {state === "login" ? "Log In" : "Sign Up"}
          </h2>
          <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
            {state === "login"
              ? "Welcome back, enter your details to log in"
              : "Welcome to Skip Fit, enter your details to create an account"}
          </p>

          {state !== "login" && (
            <div className="mt-4">
              <label className="font-medium text-sm text-gray-700 dark:text-gray-400">
                Username
              </label>
              <div className="relative mt-2 ">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
                <input
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="login-input"
                  placeholder="Enter your name sweetheart"
                  type="text"
                  required
                />
              </div>
            </div>
          )}
          {/* email */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-400">
              Email Address
            </label>
            <div className="relative mt-2 ">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="sweetheart@example.com"
                type="email"
                required
              />
            </div>
          </div>

          {/* password */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-400">
              Password
            </label>
            <div className="relative mt-2 ">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input pr-10"
                placeholder="Enter a password sweetie"
                type={showPassword ? "text" : "password"}
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting
              ? "Signing in"
              : state === "login"
                ? "Login"
                : " Sign up"}
          </button>
          {state === "login" ? (
            <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <button onClick={()=>setState("sign-up")} className="ml-1 cursor-pointer text-green-600 hover:underline">
                Sign Up
              </button>{" "}
            </p>
          ) : (
            <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button onClick={()=>(setState('login'))} className="ml-1 cursor-pointer text-green-600 hover:underline">
                Sign in
              </button>
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
