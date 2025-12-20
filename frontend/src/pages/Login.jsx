import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(at 0% 0%, #f0f4f8 0, transparent 50%), " +
          "radial-gradient(at 100% 0%, #e8f0fe 0, transparent 50%), " +
          "radial-gradient(at 50% 100%, #ffffff 0, transparent 50%)",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 6,
            bgcolor: "#ffffff",
            border: "1px solid #dadce0",
            boxShadow:
              "0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)",
            textAlign: "center",
          }}
        >
          {/* Brand Identity */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#1a73e8", letterSpacing: -0.5 }}
            >
              Arshal Spares
            </Typography>
            <Typography
              variant="h6"
              sx={{ mt: 1, fontWeight: 400, color: "#202124" }}
            >
              Sign in
            </Typography>
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
              Continue to your Inventory Dashboard
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email or phone"
                variant="outlined"
                autoComplete="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
              <TextField
                fullWidth
                label="Enter your password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />

              {/* 🌟 SPACING ADJUSTED: Forgot Password Link Removed */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "#1a73e8",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#f1f3f4" },
                  }}
                >
                  Create account
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: "#1a73e8",
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1765cc" },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
