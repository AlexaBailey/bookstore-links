import React from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "../store/slices/api/authApi";
import { setAuthState } from "../store/slices/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUserFromToken } from "../helpers/auth";

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      const { token } = response;
      localStorage.setItem("authToken", token);
      const user = getUserFromToken(token);
      dispatch(setAuthState({ token, user: user }));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.data?.message || "Login failed.");
    }
  };

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center">
      <div className="p-6 max-w-md mx-auto  bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <a className="text-blue-700 italic " href="/register">
            Not a member yet?
          </a>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              {...register("username")}
              className="w-full p-2 border rounded"
              placeholder="Enter username"
            />
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded"
              placeholder="Enter password"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
