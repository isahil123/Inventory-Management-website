import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts(token);
  }, [navigate]);

  const fetchProducts = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { "x-auth-token": token },
      });
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleOrderClick = (productId) => {
    setSelectedId(productId);
    setOpenModal(true);
  };

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders",
        { productId: selectedId, address: address },
        { headers: { "x-auth-token": token } }
      );
      setOpen(true);
      setOpenModal(false);
      setAddress("");
      setProducts(
        products.map((p) =>
          p._id === selectedId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    } catch (err) {
      setError(err.response?.data?.msg || "Order Failed!");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        // 🌟 GOOGLE SOFT MESH GRADIENT
        background:
          "radial-gradient(at 0% 0%, #f0f4f8 0, transparent 50%), " +
          "radial-gradient(at 100% 0%, #e8f0fe 0, transparent 50%)",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "left" }}>
          <Typography variant="h3" fontWeight={900} color="#1a237e">
            Arshal Marketplace
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Premium Machinery Spares Inventory
          </Typography>
        </Box>

        {/* 🔍 GOOGLE STYLE SEARCH */}
        <TextField
          fullWidth
          placeholder="Search for spare parts..."
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 8,
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
              bgcolor: "white",
              height: 60,
              fontSize: "1.1rem",
              boxShadow: "0 1px 3px rgba(60,64,67,.3)",
              border: "1px solid #dadce0",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* 📦 THE THICK CARDS GRID (3 per row) */}
        <Grid container spacing={4}>
          {filtered.map((p) => (
            <Grid item xs={12} md={6} lg={4} key={p._id}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 6,
                  bgcolor: "#ffffff",
                  border: "1px solid #dadce0",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  // 🌟 PREMIUM HOVER
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 10px 30px 5px rgba(60,64,67,0.15)",
                    borderColor: "#1a73e8",
                  },
                }}
              >
                {/* Visual Header */}
                <Box
                  sx={{
                    height: 120,
                    bgcolor: "#f8f9fa",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <EngineeringIcon
                    sx={{ fontSize: 60, color: "#4285f4", opacity: 0.7 }}
                  />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.disabled"
                    sx={{ letterSpacing: 1 }}
                  >
                    SKU: {p.sku}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ mt: 1, color: "#202124" }}
                  >
                    {p.name}
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      mb: 2,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h4" fontWeight={900} color="#1a237e">
                      ₹{p.price.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / unit
                    </Typography>
                  </Box>

                  <Chip
                    label={
                      p.quantity > 0
                        ? `${p.quantity} Units in Stock`
                        : "Stock Out"
                    }
                    size="small"
                    color={p.quantity > 0 ? "success" : "error"}
                    sx={{ fontWeight: 700, borderRadius: 1.5, mb: 3 }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={p.quantity <= 0}
                  onClick={() => handleOrderClick(p._id)}
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#1a73e8",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1765cc", boxShadow: "none" },
                  }}
                >
                  Confirm Purchase
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🏠 Order Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delivery Address</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Shipping Address"
            multiline
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrder}
            variant="contained"
            sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Order Placed Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BuyerDashboard;
