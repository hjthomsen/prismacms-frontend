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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { Customer } from "../types";
import { getStatusLabel } from "../hooks/useFinancialStatements";

interface FinancialStatementDialogProps {
  open: boolean;
  mode: "add" | "edit";
  customers: Customer[];
  formData: {
    customerId: number;
    year: number;
    status: number;
  };
  onClose: () => void;
  onSave: () => void;
  onFormChange: (
    field: keyof FinancialStatementDialogProps["formData"],
    value: string | number
  ) => void;
}

const FinancialStatementDialog: React.FC<FinancialStatementDialogProps> = ({
  open,
  mode,
  customers,
  formData,
  onClose,
  onSave,
  onFormChange,
}) => {
  const isEdit = mode === "edit";
  const title = isEdit
    ? "Edit Financial Statement"
    : "Add New Financial Statement";
  const saveButtonText = isEdit ? "Save Changes" : "Add Statement";

  const statusOptions = [
    { value: 0, label: "Draft" },
    { value: 1, label: "In Progress" },
    { value: 3, label: "Completed" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
          {/* Customer and Year */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: 2, minWidth: 300 }}>
              <FormControl fullWidth required>
                <InputLabel>Customer</InputLabel>
                <Select
                  value={formData.customerId || 0}
                  label="Customer"
                  onChange={(e) =>
                    onFormChange("customerId", e.target.value as number)
                  }
                >
                  <MenuItem value={0}>
                    <em>Select a customer</em>
                  </MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, minWidth: 150 }}>
              <TextField
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  onFormChange(
                    "year",
                    parseInt(e.target.value) || new Date().getFullYear()
                  )
                }
                fullWidth
                required
                inputProps={{ min: 2000, max: 2050 }}
              />
            </Box>
          </Box>

          {/* Status */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Status
            </Typography>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status ?? 0}
                label="Status"
                onChange={(e) =>
                  onFormChange("status", e.target.value as number)
                }
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Info about current status */}
          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Current Status:</strong> {getStatusLabel(formData.status)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This financial statement will be tracked for {formData.year} and
              assigned to the selected customer.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formData.customerId || !formData.year}
        >
          {saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinancialStatementDialog;
