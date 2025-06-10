import { useState, useEffect } from "react";
import { customerService } from "../api/client";
import type { Customer } from "../types";

interface CustomerFormData {
  name: string;
  orgNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const initialFormData: CustomerFormData = {
  name: "",
  orgNumber: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<CustomerFormData>(initialFormData);

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<CustomerFormData>(initialFormData);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      console.log("Fetched customers:", data);
      setCustomers(data);
    } catch (err) {
      setError("Failed to fetch customers. Please try again.");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditCustomer = (customer: Customer) => {
    console.log("Editing customer:", customer);
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name || "",
      orgNumber: customer.orgNumber || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      postalCode: customer.postalCode || "",
      country: customer.country || "",
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCustomer(null);
    setEditForm(initialFormData);
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;

    try {
      const updatePayload: Partial<Customer> = {
        name: editForm.name.trim(),
        orgNumber: editForm.orgNumber.trim(),
      };

      if (editForm.email.trim()) updatePayload.email = editForm.email.trim();
      if (editForm.phone.trim()) updatePayload.phone = editForm.phone.trim();
      if (editForm.address.trim())
        updatePayload.address = editForm.address.trim();
      if (editForm.city.trim()) updatePayload.city = editForm.city.trim();
      if (editForm.postalCode.trim())
        updatePayload.postalCode = editForm.postalCode.trim();
      if (editForm.country.trim())
        updatePayload.country = editForm.country.trim();

      console.log("Sending update payload:", updatePayload);
      console.log("Updating customer ID:", editingCustomer.id);

      const savedCustomer = await customerService.update(
        editingCustomer.id,
        updatePayload
      );

      console.log("Received updated customer:", savedCustomer);
      console.log("API call successful, updating local state...");

      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id ? savedCustomer : customer
        )
      );

      await fetchCustomers();
      handleCloseEditDialog();
    } catch (err) {
      setError("Failed to update customer. Please try again.");
      console.error("Error updating customer:", err);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.delete(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (err) {
        setError("Failed to delete customer. Please try again.");
        console.error("Error deleting customer:", err);
      }
    }
  };

  const handleAddCustomer = () => {
    setAddForm(initialFormData);
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setAddForm(initialFormData);
  };

  const handleSaveNewCustomer = async () => {
    try {
      const newCustomerData: Omit<Customer, "id"> = {
        name: addForm.name.trim(),
        orgNumber: addForm.orgNumber.trim(),
      };

      if (addForm.email.trim()) newCustomerData.email = addForm.email.trim();
      if (addForm.phone.trim()) newCustomerData.phone = addForm.phone.trim();
      if (addForm.address.trim())
        newCustomerData.address = addForm.address.trim();
      if (addForm.city.trim()) newCustomerData.city = addForm.city.trim();
      if (addForm.postalCode.trim())
        newCustomerData.postalCode = addForm.postalCode.trim();
      if (addForm.country.trim())
        newCustomerData.country = addForm.country.trim();

      console.log("Creating new customer:", newCustomerData);

      const createdCustomer = await customerService.create(newCustomerData);

      console.log("Created customer:", createdCustomer);

      setCustomers([...customers, createdCustomer]);
      await fetchCustomers();
      handleCloseAddDialog();
    } catch (err) {
      setError("Failed to create customer. Please try again.");
      console.error("Error creating customer:", err);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFormChange = (field: string, value: string) => {
    setAddForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    // State
    customers,
    loading,
    error,
    setError,

    // Edit dialog
    editDialogOpen,
    editForm,
    handleEditCustomer,
    handleCloseEditDialog,
    handleSaveCustomer,
    handleFormChange,

    // Add dialog
    addDialogOpen,
    addForm,
    handleAddCustomer,
    handleCloseAddDialog,
    handleSaveNewCustomer,
    handleAddFormChange,

    // Other operations
    handleDeleteCustomer,
  };
};
