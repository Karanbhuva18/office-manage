import { useMutation } from "@tanstack/react-query";
import type { Payment, User } from "../types";
import axiosInstance from "../api/axiosIntersepter";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface ErrorResponse {
  message: string;
}

const createUser = async (userData: User) => {
  try {
    const reponse = await axiosInstance.post("/user/create", userData);
    return reponse;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,

    onSuccess: (data) => {
      console.log("User created successfully:", data.data);

      toast.success(data?.data?.message || "User created successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating user:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

const loginUser = async (userData: Omit<User, "name" | "role">) => {
  try {
    const reponse = await axiosInstance.post("/user/login", userData);
    return reponse;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const userLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.data?.accessToken) {
        localStorage.setItem("token", data.data.accessToken);
      }
      toast.success(data?.data?.message || "User logged in successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error logging in user:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

const createClient = async (clientData: {
  name: string;
  phone: string;
  email: string;
}) => {
  try {
    const reponse = await axiosInstance.post(
      "/client/createClient",
      clientData,
    );
    return reponse;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const useclientCreate = () => {
  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      console.log("Client created successfully:", data.data);
      toast.success(data?.data?.message || "Client created successfully");
    },
  });
};

const deleteClient = async (id: number) => {
  try {
    const reponse = await axiosInstance.delete(`/client/delete/${id}`);
    return reponse;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      console.log("Client deleted successfully:", data.data);
      toast.success(data?.data?.message || "Client deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error deleting client:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

const updateClient = async ({
  id,
  name,
  email,
  phone,
}: {
  id: number;
  name: string;
  email: string;
  phone: string;
}) => {
  try {
    const response = await axiosInstance.put(`/client/update/${id}`, {
      name,
      email,
      phone,
    });
    return response;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const useUpdateClient = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      console.log("Client updated successfully:", data.data);
      toast.success(data?.data?.message || "Client updated successfully");
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error updating client:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

export const createProduct = async (productData: {
  name: string;
  price: number;
  tax: number;
  description: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "product/createProduct",
      productData,
    );
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const useCreateProduct = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      console.log("Product created successfully:", data.data);
      toast.success(data?.data?.message || "Product created successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/product/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      console.log("Product deleted successfully:", data.data);
      toast.success(data?.data?.message || "Product deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export const updateProduct = async (productData: {
  id: number;
  name: string;
  price: number;
  tax: number;
  description: string;
}) => {
  try {
    const response = await axiosInstance.put(
      `/product/update/${productData.id}`,
      productData,
    );
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const useUpdateProduct = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      console.log("Product updated successfully:", data.data);
      toast.success(data?.data?.message || "Product updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setIsModalOpen(false);
    },
  });
};

export const createSale = async (saleData: {
  clientId: number;
  productId: number;
  amount: number;
  sallerId?: number;
  paymentType?: string;
}) => {
  try {
    console.log("saleData", saleData);
    const response = await axiosInstance.post("/sale", saleData);
    return response.data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
};

export const useCreateSale = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      console.log("Sale created successfully:", data);
      toast.success(data?.message || "Sale created successfully");
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating sale:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

export const createPayment = async(paymentData: Payment) => {
  try{
    const response = await axiosInstance.post("/payment", paymentData);
    return response.data;
  }catch(error){
    console.error("Error creating payment:", error);
    throw error;
  }
}

export const useCreatePayment = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      console.log("Payment created successfully:", data);
      toast.success(data?.message || "Payment created successfully");
      // queryClient.invalidateQueries({
      //   queryKey: ["payments"],
      // });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating payment:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
