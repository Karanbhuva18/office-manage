import React from "react";
import { useForm } from "react-hook-form";
import type { SignupFormData } from "../Schema";
import { signupResolver } from "../Schema";
import { useCreateUser } from "../hooks/customMutation";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: signupResolver,
  });
  const { mutate } = useCreateUser();
  const onSubmit = (data: SignupFormData) => {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: "employee",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Enter name"
            {...register("name")}
            className="w-full border p-2 rounded-md"
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Enter email"
            {...register("email")}
            className="w-full border p-2 rounded-md"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password")}
            className="w-full border p-2 rounded-md"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
            className="w-full border p-2 rounded-md"
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
