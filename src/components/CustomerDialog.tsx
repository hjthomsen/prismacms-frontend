import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";

interface CustomerDialogProps {
  open: boolean;
  mode: "add" | "edit";
  formData: {
    name: string;
    orgNumber: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onClose: () => void;
  onSave: () => void;
  onFormChange: (field: string, value: string) => void;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  mode,
  formData,
  onClose,
  onSave,
  onFormChange,
}) => {
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Customer" : "Add New Customer";
  const saveButtonText = isEdit ? "Save Changes" : "Add Customer";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Customer Name"
            value={formData.name}
            onChange={(e) => onFormChange("name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Organization Number"
            value={formData.orgNumber}
            onChange={(e) => onFormChange("orgNumber", e.target.value)}
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
              value={formData.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => onFormChange("phone", e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => onFormChange("address", e.target.value)}
            fullWidth
            multiline
            rows={2}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => onFormChange("city", e.target.value)}
              fullWidth
            />
            <TextField
              label="Postal Code"
              value={formData.postalCode}
              onChange={(e) => onFormChange("postalCode", e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Country"
            value={formData.country}
            onChange={(e) => onFormChange("country", e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formData.name || !formData.orgNumber}
        >
          {saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;
