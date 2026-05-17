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
