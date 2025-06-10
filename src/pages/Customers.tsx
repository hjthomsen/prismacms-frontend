import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useCustomers } from "../hooks/useCustomers";
import CustomerTable from "../components/CustomerTable";
import CustomerDialog from "../components/CustomerDialog";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
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
  } = useCustomers();

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading customers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Customers
        </Typography>
        <Typography variant="body1" className="page-subtitle">
          Manage your customer database
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Actions Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search customers..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
      </Box>

      {/* Customers Stats */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Customers
            </Typography>
            <Typography variant="h4">{customers.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Customers
            </Typography>
            <Typography variant="h4">{customers.length}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Customers Table */}
      <CustomerTable
        customers={customers}
        searchTerm={searchTerm}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />

      {/* Customer Dialog - handles both add and edit */}
      <CustomerDialog
        open={editDialogOpen || addDialogOpen}
        mode={editDialogOpen ? "edit" : "add"}
        formData={editDialogOpen ? editForm : addForm}
        onClose={editDialogOpen ? handleCloseEditDialog : handleCloseAddDialog}
        onSave={editDialogOpen ? handleSaveCustomer : handleSaveNewCustomer}
        onFormChange={editDialogOpen ? handleFormChange : handleAddFormChange}
      />
    </Box>
  );
};

export default Customers;
