import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import type { FinancialStatement } from "../types";
import { getStatusLabel } from "../hooks/useFinancialStatements";

interface FinancialStatementTableProps {
  statements: FinancialStatement[];
  searchTerm: string;
  onEdit: (statement: FinancialStatement) => void;
  onDelete: (id: number) => void;
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return "default";
    case 1:
      return "primary";
    case 3:
      return "success";
    default:
      return "default";
  }
};

const FinancialStatementTable: React.FC<FinancialStatementTableProps> = ({
  statements,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  const filteredStatements = statements.filter(
    (statement) =>
      statement.customerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getStatusLabel(statement.status)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      statement.year.toString().includes(searchTerm)
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  if (filteredStatements.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <BusinessIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {searchTerm
            ? "No financial statements match your search"
            : "No financial statements found"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {searchTerm
            ? "Try adjusting your search terms"
            : "Create your first financial statement to get started"}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Customer</strong>
            </TableCell>
            <TableCell>
              <strong>Year</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
            <TableCell>
              <strong>Created</strong>
            </TableCell>
            <TableCell>
              <strong>Last Modified</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStatements.map((statement) => (
            <TableRow key={statement.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {statement.customerName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{statement.year}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(statement.status)}
                  size="small"
                  color={
                    getStatusColor(statement.status) as
                      | "default"
                      | "primary"
                      | "secondary"
                      | "error"
                      | "info"
                      | "success"
                      | "warning"
                  }
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(statement.createdAt)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(statement.lastModifiedAt || undefined)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEdit(statement)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(statement.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinancialStatementTable;
