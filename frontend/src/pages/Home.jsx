import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Stack,
  Divider,
  Link,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import BusinessIcon from "@mui/icons-material/Business";

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Buyer";
  const username = localStorage.getItem("username") || "User";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
      }}
    >
      {/* 🚀 1. HERO SECTION & ABOUT THE PAGE */}
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography
              variant="h3"
              fontWeight={900}
              color="#1a237e"
              gutterBottom
            >
              नमस्ते, {username}!
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Welcome to the Machinery Spares Inventory Portal
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.8 }}
            >
              This portal digitizes our machinery spares wholesale business,
              allowing real-time stock checks, order placement, and
              address-based delivery tracking, with an automatic stock
              restoration system to prevent business interruptions, ensuring
              seamless operations
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate(role === "buyer" ? "/buyer-dashboard" : "/dashboard")
              }
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Go to my {role} Panel
            </Button>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: "#e3f2fd",
                borderRadius: 8,
                textAlign: "center",
                border: "1px solid #bbdefb",
              }}
            >
              <BusinessIcon sx={{ fontSize: 80, color: "#1976d2", mb: 2 }} />
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Our Identity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Punjab's first integrated B2B machinery inventory system
                designed for scale and reliability.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 🛠️ 2. THE BIG FOOTER (About, Contact, Location) */}
      <Box
        component="footer"
        sx={{ bgcolor: "#1a237e", color: "white", pt: 8, pb: 4 }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Column 1: About Us */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                fontWeight={800}
                gutterBottom
                sx={{ color: "#90caf9" }}
              >
                ABOUT US
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, lineHeight: 1.7 }}
              >
                "We are Machinery Spares Mall, based in Jalandhar, Punjab. Our
                aim is to provide every industrial unit with high-quality spare
                parts at factory rates.
              </Typography>
            </Grid>

            {/* Column 2: Contact Us */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                fontWeight={800}
                gutterBottom
                sx={{ color: "#90caf9" }}
              >
                CONTACT US
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PhoneIcon fontSize="small" sx={{ color: "#4caf50" }} />
                  <Typography variant="body2">+91 91234 56789</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EmailIcon fontSize="small" sx={{ color: "#ff9800" }} />
                  <Typography variant="body2">
                    support@arshalspares.com
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: "#f44336" }} />
                  <Typography variant="body2">
                    Phase 1, Patliputra Industrial Estate, Jalandhar, Punjab -
                    144001
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Column 3: Legal & System Status */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                fontWeight={800}
                gutterBottom
                sx={{ color: "#90caf9" }}
              >
                SYSTEM INFO
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                System Version: 2.0.1 (Stable)
                <br />
                Licensed to: Arshal Machinery Mall
                <br />
                Status: All Systems Operational ✅
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, bgcolor: "rgba(255,255,255,0.1)" }} />

          {/* Copyright & Location Footer */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Arshal Machinery Mall. Built with
              MERN Stack. Proudly made in <strong>INDIA</strong>.
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, opacity: 0.5 }}
            >
              All spares are ISO certified and trademarked under Indian
              Industrial Laws.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
