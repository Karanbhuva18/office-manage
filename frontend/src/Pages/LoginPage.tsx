import { useForm } from "react-hook-form";
import { loginResolver, type LoginFormData } from "../Schema";
import { userLogin } from "../hooks/customMutation";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: loginResolver,
  });
  const { mutate: loginUser } = userLogin();
  const onSubmit = (data: LoginFormData) => {
    loginUser({
      email: data.email,
      password: data.password,
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
