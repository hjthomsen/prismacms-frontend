export interface Customer {
  id: number;
  name: string;
  orgNumber: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface FinancialStatement {
  id: number;
  customerId: number;
  year: number;
  status: string;
}

export interface Assignment {
  id: number;
  financialStatementId: number;
  employeeId: number;
  allocatedHours: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface EmployeeTimeEntry {
  id: number;
  assignmentId: number;
  date: string;
  hoursWorked: number;
  description: string;
}
