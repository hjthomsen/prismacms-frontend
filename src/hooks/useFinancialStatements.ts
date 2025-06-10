import { useState, useEffect } from "react";
import type { FinancialStatement, Customer } from "../types";
import { financialStatementService, customerService } from "../api/client";

interface FinancialStatementForm {
  customerId: number;
  year: number;
  status: number; // 0 = Draft, 1 = In Progress, 3 = Completed
}

// Helper functions for status conversion
export const getStatusLabel = (status: number): string => {
  switch (status) {
    case 0:
      return "Draft";
    case 1:
      return "In Progress";
    case 3:
      return "Completed";
    default:
      return "Unknown";
  }
};

export const getStatusNumber = (label: string): number => {
  switch (label) {
    case "Draft":
      return 0;
    case "In Progress":
      return 1;
    case "Completed":
      return 3;
    default:
      return 0;
  }
};

export const useFinancialStatements = () => {
  // State
  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStatement, setEditingStatement] =
    useState<FinancialStatement | null>(null);
  const [editForm, setEditForm] = useState<FinancialStatementForm>({
    customerId: 0,
    year: new Date().getFullYear(),
    status: 0, // Draft
  });

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<FinancialStatementForm>({
    customerId: 0,
    year: new Date().getFullYear(),
    status: 0, // Draft
  });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statementsData, customersData] = await Promise.all([
        financialStatementService.getAll(),
        customerService.getAll(),
      ]);

      // Enrich statements with customer names
      const enrichedStatements = statementsData.map((statement) => ({
        ...statement,
        customerName:
          statement.customer?.name ||
          customersData.find((c) => c.id === statement.customerId)?.name ||
          "Unknown Customer",
      }));

      setStatements(enrichedStatements);
      setCustomers(customersData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load financial statements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Edit dialog handlers
  const handleEditStatement = (statement: FinancialStatement) => {
    setEditingStatement(statement);
    setEditForm({
      customerId: statement.customerId || 0,
      year: statement.year || new Date().getFullYear(),
      status: statement.status ?? 0,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingStatement(null);
    setEditForm({
      customerId: 0,
      year: new Date().getFullYear(),
      status: 0,
    });
  };

  const handleSaveStatement = async () => {
    if (!editingStatement) return;

    try {
      setError(null);
      await financialStatementService.update(editingStatement.id, editForm);
      await loadData(); // Refresh the list
      handleCloseEditDialog();
    } catch (err) {
      console.error("Error updating statement:", err);
      setError("Failed to update financial statement");
    }
  };

  const handleFormChange = (
    field: keyof FinancialStatementForm,
    value: string | number
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value ?? (typeof prev[field] === "string" ? "" : 0),
    }));
  };

  // Add dialog handlers
  const handleAddStatement = () => {
    setAddForm({
      customerId: 0,
      year: new Date().getFullYear(),
      status: 0,
    });
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setAddForm({
      customerId: 0,
      year: new Date().getFullYear(),
      status: 0,
    });
  };

  const handleSaveNewStatement = async () => {
    if (!addForm.customerId) {
      setError("Please select a customer");
      return;
    }

    try {
      setError(null);
      await financialStatementService.create(addForm);
      await loadData(); // Refresh the list
      handleCloseAddDialog();
    } catch (err) {
      console.error("Error creating statement:", err);
      setError("Failed to create financial statement");
    }
  };

  const handleAddFormChange = (
    field: keyof FinancialStatementForm,
    value: string | number
  ) => {
    setAddForm((prev) => ({
      ...prev,
      [field]: value ?? (typeof prev[field] === "string" ? "" : 0),
    }));
  };

  // Delete handler
  const handleDeleteStatement = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this financial statement?"
      )
    ) {
      return;
    }

    try {
      setError(null);
      await financialStatementService.delete(id);
      await loadData(); // Refresh the list
    } catch (err) {
      console.error("Error deleting statement:", err);
      setError("Failed to delete financial statement");
    }
  };

  return {
    // State
    statements,
    customers,
    loading,
    error,
    setError,

    // Edit dialog
    editDialogOpen,
    editForm,
    handleEditStatement,
    handleCloseEditDialog,
    handleSaveStatement,
    handleFormChange,

    // Add dialog
    addDialogOpen,
    addForm,
    handleAddStatement,
    handleCloseAddDialog,
    handleSaveNewStatement,
    handleAddFormChange,

    // Other operations
    handleDeleteStatement,
    loadData,
  };
};
