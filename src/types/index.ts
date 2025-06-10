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
  customer?: Customer | null; // Populated by API
  customerName?: string; // For display purposes
  year: number;
  status: number; // 0 = Draft, 1 = In Progress, 3 = Completed
  createdAt?: string;
  createdBy?: string | null;
  lastModifiedAt?: string | null;
  lastModifiedBy?: string | null;
  assignments?: Assignment[];
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
