import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer", // 🌟 Default changed to buyer for better UX
    secretKey: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      // ✅ SUCCESS: Save Data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      // 🚀 SMART REDIRECT LOGIC
      const role = res.data.role.toLowerCase();
      if (role === "admin" || role === "manager") {
        navigate("/dashboard");
      } else if (role === "staff") {
        navigate("/inventory");
      } else {
        navigate("/buyer-dashboard"); // 🛒 Send buyers to their shop
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Registration failed. Check your details."
      );
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 5,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 6,
            border: "1px solid #dadce0",
            textAlign: "center",
            bgcolor: "white",
          }}
        >
          {/* Google Style Avatar */}
          <Avatar
            sx={{ m: "auto", bgcolor: "#34a853", mb: 2, width: 56, height: 56 }}
          >
            <PersonAddOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "#202124", mb: 1 }}
          >
            Create your Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join the Machine Spares Wholesale Network
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="username"
              variant="outlined"
              margin="normal"
              required
              onChange={handleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              required
              onChange={handleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              helperText="At least 6 characters"
              onChange={handleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* ROLE SELECTOR */}
            <TextField
              select
              fullWidth
              label="Register As"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                textAlign: "left",
              }}
            >
              <MenuItem value="buyer">Buyer (Search & Purchase)</MenuItem>
              <MenuItem value="staff">Staff (Inventory Worker)</MenuItem>
              <MenuItem value="manager">Manager (Warehouse Head)</MenuItem>
              <MenuItem value="admin">Admin (System Owner)</MenuItem>
            </TextField>

            {/* 🔒 SECRET KEY (Only for Admin/Manager) */}
            {(formData.role === "admin" || formData.role === "manager") && (
              <Box
                sx={{
                  bgcolor: "#fff3e0",
                  p: 2,
                  borderRadius: 2,
                  mt: 2,
                  border: "1px dashed #ff9800",
                }}
              >
                <Typography variant="caption" color="orange" fontWeight="bold">
                  ⚠️ Restricted Access Code Required
                </Typography>
                <TextField
                  fullWidth
                  label="Secret Key"
                  name="secretKey"
                  type="password"
                  margin="dense"
                  required
                  onChange={handleChange}
                  variant="standard"
                />
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 3,
                py: 1.5,
                bgcolor: "#1a73e8",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { bgcolor: "#1557b0", boxShadow: "none" },
              }}
            >
              Create Account
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already part of the network?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#1a73e8",
                    fontWeight: 600,
                  }}
                >
                  Sign in instead
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
