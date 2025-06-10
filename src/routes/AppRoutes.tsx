import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import FinancialStatements from "../pages/FinancialStatements";
import Timesheet from "../pages/Timesheet";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/financial-statements" element={<FinancialStatements />} />
    <Route path="/timesheet" element={<Timesheet />} />
  </Routes>
);

export default AppRoutes;
