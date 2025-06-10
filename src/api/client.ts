import axios from "axios";
import type { Customer } from "../types";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // or your backend URL
});

// Customer API functions
export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>("/customers");
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: Omit<Customer, "id">): Promise<Customer> => {
    const response = await api.post<Customer>("/customers", customer);
    return response.data;
  },

  update: async (
    id: number,
    customer: Partial<Customer>
  ): Promise<Customer> => {
    console.log(`Making PUT request to /customers/${id}`, customer); // Debug log
    const response = await api.put<Customer>(`/customers/${id}`, customer);
    console.log(`PUT response status: ${response.status}`, response.data); // Debug log

    // Handle 204 No Content response (successful update but no data returned)
    if (response.status === 204) {
      console.log("Update successful (204), fetching updated customer...");
      // Fetch the updated customer since the server didn't return it
      const updatedCustomer = await api.get<Customer>(`/customers/${id}`);
      return updatedCustomer.data;
    }

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

export default api;
