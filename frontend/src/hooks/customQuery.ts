import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosIntersepter.ts";

const fetchClients = async ({
  page,
  limit,
  client,
}: {
  page: number;
  limit: number;
  client: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `client/getClient?page=${page}&limit=${limit}&client=${client}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};
export const useGetClients = (page: number, limit: number, client: string) => {
  return useQuery({
    queryKey: ["clients", page, limit, client],

    queryFn: async () => {
      console.log("API CALLED:", client);

      return fetchClients({
        page,
        limit,
        client,
      });
    },
    enabled: client.length >= 0,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const getProducts = async ({
  page,
  limit,
  product,
}: {
  page: number;
  limit: number;
  product: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `product/getProduct?page=${page}&limit=${limit}&product=${product}`,
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const useGetProducts = (
  page: number,
  limit: number,
  product: string,
) => {
  return useQuery({
    queryKey: ["products", page, limit, product],
    queryFn: async () => {
      console.log("API CALLED:", product);
      return getProducts({
        page,
        limit,
        product,
      });
    },
    enabled: product.length >= 0,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const getSales = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `/sale?page=${page}&limit=${limit}&status=${status}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};

export const userGetSales = (page: number, limit: number, status: string) => {
  return useQuery({
    queryKey: ["sales", page, limit, status],
    queryFn: async () => {
      return getSales({ page, limit, status });
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const getPayments = async () => {
  try {
    const response = await axiosInstance.get("/payment");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const userGetPayments = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["payments", page, limit],
    queryFn: getPayments,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const getAttendance = async () => {
  try {
    const response = await axiosInstance.get("/attendance/get-attendance");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error;
  }
};

export const userGetAttendance = ({ date }: { date: string }) => {
  return useQuery({
    queryKey: ["attendance", date],
    queryFn: getAttendance,
    placeholderData: (previousData) => previousData,
  });
};
