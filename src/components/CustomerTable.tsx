import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { Customer } from "../types";

interface CustomerTableProps {
  customers: Customer[];
  searchTerm: string;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  searchTerm,
  onEdit,
  onDelete,
}) => {
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

  return (
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
                      <IconButton size="small" onClick={() => onEdit(customer)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Customer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(customer.id)}
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
  );
};

export default CustomerTable;
