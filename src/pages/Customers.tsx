import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { customerService } from "../api/client";
import type { Customer } from "../types";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    orgNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    orgNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      console.log("Fetched customers:", data); // Debug log
      setCustomers(data);
    } catch (err) {
      setError("Failed to fetch customers. Please try again.");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
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

  const handleEditCustomer = (customer: Customer) => {
    console.log("Editing customer:", customer); // Debug log
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
    setEditForm({
      name: "",
      orgNumber: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;

    try {
      // Create the update payload with only the fields we want to update
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

      console.log("Sending update payload:", updatePayload); // Debug log
      console.log("Updating customer ID:", editingCustomer.id); // Debug log

      const savedCustomer = await customerService.update(
        editingCustomer.id,
        updatePayload
      );

      console.log("Received updated customer:", savedCustomer); // Debug log
      console.log("API call successful, updating local state..."); // Debug log

      // Update the local state with the response from the server
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id ? savedCustomer : customer
        )
      );

      // Also refresh the data from the server to ensure consistency
      await fetchCustomers();

      handleCloseEditDialog();
    } catch (err) {
      setError("Failed to update customer. Please try again.");
      console.error("Error updating customer:", err);
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

  const handleAddCustomer = () => {
    setAddForm({
      name: "",
      orgNumber: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setAddForm({
      name: "",
      orgNumber: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });
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

      console.log("Creating new customer:", newCustomerData); // Debug log

      const createdCustomer = await customerService.create(newCustomerData);

      console.log("Created customer:", createdCustomer); // Debug log

      // Add the new customer to the local state
      setCustomers([...customers, createdCustomer]);

      // Refresh the data from the server to ensure consistency
      await fetchCustomers();

      handleCloseAddDialog();
    } catch (err) {
      setError("Failed to create customer. Please try again.");
      console.error("Error creating customer:", err);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      String(customer.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(customer.orgNumber || "").includes(searchTerm) ||
      (customer.email &&
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchTerm))
  );

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
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    Customer Name
                  </Box>
                </TableCell>
                <TableCell>Organization Number</TableCell>
                <TableCell>Contact Information</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {searchTerm
                        ? "No customers found matching your search."
                        : "No customers found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {customer.name || "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {customer.orgNumber || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        {customer.email && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {customer.email}
                            </Typography>
                          </Box>
                        )}
                        {customer.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {customer.phone}
                            </Typography>
                          </Box>
                        )}
                        {!customer.email && !customer.phone && (
                          <Typography variant="body2" color="textSecondary">
                            No contact info
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Customer">
                        <IconButton
                          size="small"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Customer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Customer Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Customer Name"
              value={editForm.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Organization Number"
              value={editForm.orgNumber}
              onChange={(e) => handleFormChange("orgNumber", e.target.value)}
              fullWidth
              required
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Contact Information
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={editForm.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Address"
              value={editForm.address}
              onChange={(e) => handleFormChange("address", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="City"
                value={editForm.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="Postal Code"
                value={editForm.postalCode}
                onChange={(e) => handleFormChange("postalCode", e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Country"
              value={editForm.country}
              onChange={(e) => handleFormChange("country", e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleSaveCustomer}
            variant="contained"
            disabled={!editForm.name || !editForm.orgNumber}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Customer Name"
              value={addForm.name}
              onChange={(e) => handleAddFormChange("name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Organization Number"
              value={addForm.orgNumber}
              onChange={(e) => handleAddFormChange("orgNumber", e.target.value)}
              fullWidth
              required
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Contact Information
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={addForm.email}
                onChange={(e) => handleAddFormChange("email", e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={addForm.phone}
                onChange={(e) => handleAddFormChange("phone", e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Address"
              value={addForm.address}
              onChange={(e) => handleAddFormChange("address", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="City"
                value={addForm.city}
                onChange={(e) => handleAddFormChange("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="Postal Code"
                value={addForm.postalCode}
                onChange={(e) =>
                  handleAddFormChange("postalCode", e.target.value)
                }
                fullWidth
              />
            </Box>

            <TextField
              label="Country"
              value={addForm.country}
              onChange={(e) => handleAddFormChange("country", e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button
            onClick={handleSaveNewCustomer}
            variant="contained"
            disabled={!addForm.name || !addForm.orgNumber}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
