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
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material";
import { useFinancialStatements } from "../hooks/useFinancialStatements";
import FinancialStatementTable from "../components/FinancialStatementTable";
import FinancialStatementDialog from "../components/FinancialStatementDialog";

const FinancialStatements = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
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
  } = useFinancialStatements();

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading financial statements...
        </Typography>
      </Box>
    );
  }

  // Calculate statistics
  const totalStatements = statements.length;
  const completedStatements = statements.filter((s) => s.status === 3).length; // Completed
  const inProgressStatements = statements.filter((s) => s.status === 1).length; // In Progress
  const draftStatements = statements.filter((s) => s.status === 0).length; // Draft

  return (
    <Box>
      {/* Page Header */}
      <Box className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Financial Statements
        </Typography>
        <Typography variant="body1" className="page-subtitle">
          Manage financial statements and track progress
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
          placeholder="Search statements..."
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
          onClick={handleAddStatement}
        >
          Add Statement
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AssessmentIcon color="primary" />
              <Typography color="textSecondary" variant="body2">
                Total Statements
              </Typography>
            </Box>
            <Typography variant="h4">{totalStatements}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CheckCircleIcon color="success" />
              <Typography color="textSecondary" variant="body2">
                Completed
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              {completedStatements}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PendingIcon color="primary" />
              <Typography color="textSecondary" variant="body2">
                In Progress
              </Typography>
            </Box>
            <Typography variant="h4" color="primary.main">
              {inProgressStatements}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ScheduleIcon color="warning" />
              <Typography color="textSecondary" variant="body2">
                Draft
              </Typography>
            </Box>
            <Typography variant="h4" color="warning.main">
              {draftStatements}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Status Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Filters
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label="All"
            onClick={() => setSearchTerm("")}
            color={searchTerm === "" ? "primary" : "default"}
            clickable
          />
          <Chip
            label="Draft"
            onClick={() => setSearchTerm("Draft")}
            color={searchTerm === "Draft" ? "primary" : "default"}
            clickable
          />
          <Chip
            label="In Progress"
            onClick={() => setSearchTerm("In Progress")}
            color={searchTerm === "In Progress" ? "primary" : "default"}
            clickable
          />

          <Chip
            label="Completed"
            onClick={() => setSearchTerm("Completed")}
            color={searchTerm === "Completed" ? "primary" : "default"}
            clickable
          />
        </Box>
      </Box>

      {/* Financial Statements Table */}
      <FinancialStatementTable
        statements={statements}
        searchTerm={searchTerm}
        onEdit={handleEditStatement}
        onDelete={handleDeleteStatement}
      />

      {/* Financial Statement Dialog - handles both add and edit */}
      <FinancialStatementDialog
        open={editDialogOpen || addDialogOpen}
        mode={editDialogOpen ? "edit" : "add"}
        customers={customers}
        formData={editDialogOpen ? editForm : addForm}
        onClose={editDialogOpen ? handleCloseEditDialog : handleCloseAddDialog}
        onSave={editDialogOpen ? handleSaveStatement : handleSaveNewStatement}
        onFormChange={editDialogOpen ? handleFormChange : handleAddFormChange}
      />
    </Box>
  );
};

export default FinancialStatements;
