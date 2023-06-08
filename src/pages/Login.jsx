import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useUser } from "../hooks/user";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, loginWithGithub, logout } = useUser();

  const handelLogin = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleGithubLogin = async () => {
    await loginWithGithub();
    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-start justify-start">
        <Link to="/">
          <span>
            <Logo className="mb-2 h-10 w-auto" />
          </span>
        </Link>
        <h2 className="mt-16 text-lg font-semibold text-gray-50">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-sky-600 font-semibold">
            Sign up
          </Link>{" "}
          for a free trial.
        </p>
      </div>
      <div className="mt-10">
        <div className="mt-6">
          <div className="space-y-7">
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="pt-1">
              <button
                onClick={handelLogin}
                className="w-full rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
        <div className="my-6 relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#10101D] text-gray-200">
              Or continue with
            </span>
          </div>
        </div>
        <div>
          <span
            onClick={handleGithubLogin}
            className=" cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Sign in with Github </span>

            <p className="text-sm font-medium text-gray-700 mr-3">
              Sign in with{" "}
            </p>
            <svg
              aria-hidden="true"
              className="octicon octicon-mark-github"
              height="24"
              version="1.1"
              viewBox="0 0 16 16"
              width="24"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
