import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  Avatar,
  MenuItem, // Added for dropdown
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BuildIcon from "@mui/icons-material/BuildCircleRounded";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    stockType: "Fresh", // 🌟 New Field: Fresh or Clearance
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      // 🚀 Validation: Ensure price is not 0
      if (formData.price <= 0) {
        setError("Bhai, price cannot be zero!");
        return;
      }

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "x-auth-token": token },
      });

      setMsg("✅ Spare Part Added to " + formData.stockType + " Inventory!");
      setTimeout(() => navigate("/inventory"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Error adding part. Check if Part ID matches an existing one."
      );
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#202124" }}>
            Register Machine Spare
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Categorize stock as Fresh or Ethical Marketplace (Clearance).
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{ p: 5, borderRadius: 6, border: "1px solid #dadce0" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: "#e8f0fe",
                color: "#1a73e8",
                width: 56,
                height: 56,
              }}
            >
              <BuildIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Inventory Entry
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Warehouse Management System
              </Typography>
            </Box>
          </Box>

          {msg && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
              {msg}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* 🌟 NEW: Stock Type Selector */}
            <TextField
              select
              fullWidth
              label="Stock Classification"
              name="stockType"
              value={formData.stockType}
              onChange={handleChange}
              margin="normal"
              helperText="Fresh stock sells at standard price; Clearance goes to Ethical Market."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              <MenuItem value="Fresh">📦 Fresh Stock (Standard Price)</MenuItem>
              <MenuItem value="Clearance">
                ♻️ Dead Stock (Ethical Marketplace - Discounted)
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Spare Part Name"
              name="name"
              placeholder="e.g. Industrial Piston Ring"
              onChange={handleChange}
              margin="normal"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              label="Part ID / SKU"
              name="sku"
              placeholder="e.g. PIS-8802"
              onChange={handleChange}
              margin="normal"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                onChange={handleChange}
                margin="normal"
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              <TextField
                fullWidth
                type="number"
                label="Unit Price"
                name="price"
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  bgcolor: "#1a73e8",
                  fontWeight: "bold",
                  borderRadius: 3,
                  boxShadow: "none",
                }}
              >
                Submit to Warehouse
              </Button>

              <Button
                variant="text"
                fullWidth
                sx={{ mt: 1, color: "#5f6368" }}
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddProduct;
