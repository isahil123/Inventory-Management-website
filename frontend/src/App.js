import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
} from "@mui/material";
import "./App.css";

// Icons
import HomeIcon from "@mui/icons-material/Home"; // 🌟 Added Home Icon
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagRounded";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// Import Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import SmartRestock from "./pages/SmartRestock";
import EthicalMarket from "./pages/EthicalMarket";
import BuyerDashboard from "./pages/BuyerDashboard";
import OrderHistory from "./pages/OrderHistory";

const googleTheme = createTheme({
  palette: {
    primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
    background: { default: "#f8f9fa", paper: "#ffffff" },
    text: { primary: "#202124", secondary: "#5f6368" },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 24 } } },
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: "0 1px 4px rgba(0,0,0,0.1)" } },
    },
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawRole = localStorage.getItem("role");
  const role = rawRole ? rawRole.toLowerCase() : "guest";

  // 🛡️ Hide Navbar ONLY on Login and Register. Show on Home (/).
  const hideNavbarRoutes = ["/login", "/register"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Home",
      path: "/", // 🌟 Internal Home
      icon: <HomeIcon />,
      roles: ["admin", "manager", "staff", "buyer"],
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
      roles: ["admin", "manager"],
    },
    {
      label: "Marketplace",
      path: "/buyer-dashboard",
      icon: <ShoppingBagIcon />,
      roles: ["buyer"],
    },
    {
      label: "Inventory",
      path: "/inventory",
      icon: <ListIcon />,
      roles: ["admin", "manager", "staff"],
    },
    {
      label: "Add Stock",
      path: "/add-product",
      icon: <AddIcon />,
      roles: ["admin", "manager"],
    },
    {
      label: "Restock Logic",
      path: "/smart-restock",
      icon: <AutoGraphIcon />,
      roles: ["admin", "manager"],
    },
    {
      label: "Ethical Deals",
      path: "/ethical-market",
      icon: <Diversity1Icon />,
      roles: ["admin", "manager", "buyer"],
    },
    {
      label: "My Orders",
      path: "/order-history",
      icon: <ReceiptLongIcon />,
      roles: ["buyer"],
    },
  ];

  return (
    <AppBar position="sticky" color="default" sx={{ bgcolor: "white" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <InventoryIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              color: "#1976d2",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: "#202124",
              textDecoration: "none",
            }}
          >
            Inventory App
          </Typography>

          <Chip
            label={role}
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              mr: 4,
              textTransform: "uppercase",
              fontSize: "0.7rem",
              height: 24,
            }}
          />

          <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            {menuItems.map(
              (item) =>
                item.roles.includes(role) && (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color:
                        location.pathname === item.path ? "#1976d2" : "#5f6368",
                      bgcolor:
                        location.pathname === item.path
                          ? "#e3f2fd"
                          : "transparent",
                    }}
                  >
                    {item.label}
                  </Button>
                )
            )}
          </Box>

          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{ boxShadow: "none", borderRadius: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function App() {
  return (
    <ThemeProvider theme={googleTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          {/* Default Route is now the Internal Home Page */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/smart-restock" element={<SmartRestock />} />
          <Route path="/ethical-market" element={<EthicalMarket />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
