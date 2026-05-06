import {
  LayoutDashboard,
  UsersRound,
  Box,
  ShoppingCart,
  CreditCard,
  UserCheck,
  Clock8,
  Receipt,
  Wallet,
  RefreshCcw,
} from "lucide-react";
import Dashboard from "../Pages/Dashboard";
import Clients from "../Pages/Clients";
import Products from "../Pages/Products";
import Sales from "../Pages/Sales";
import Payments from "../Pages/Payments";
import Employees from "../Pages/Employees";
import Attendance from "../Pages/Attendance";
import Expense from "../Pages/Expense";
import CashDrawer from "../Pages/CashDrawer";
import Reimbursment from "../Pages/Reimbursment";

export const routes = [
  {
    label: "Dashboard",
    path: "/dashboard",
    element: <Dashboard />,
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    path: "/clients",
    element: <Clients />,
    icon: UsersRound,
  },
  {
    label: "Products",
    path: "/products",
    element: <Products />,
    icon: Box,
  },
  {
    label: "Sales",
    path: "/sales",
    element: <Sales />,
    icon: ShoppingCart,
  },
  {
    label: "Payments",
    path: "/payments",
    element: <Payments />,
    icon: CreditCard,
  },
  {
    label: "Employees",
    path: "/employees",
    element: <Employees />,
    icon: UserCheck,
  },
  {
    label: "Attendance",
    path: "/attendance",
    element: <Attendance />,
    icon: Clock8,
  },
  {
    label: "Expenses",
    path: "/expenses",
    element: <Expense />,
    icon: Receipt,
  },
  {
    label: "Cash Drawer",
    path: "/cash-drawer",
    element: <CashDrawer />,
    icon: Wallet,
  },
  {
    label: "Reimbursment",
    path: "/reimbursment",
    element: <Reimbursment />,
    icon: RefreshCcw,
  },
];
