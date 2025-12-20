import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import axios from "axios";
import PaidIcon from "@mui/icons-material/Paid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // ⚠️ New Icon

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    orderCount: 0,
    cancelledCount: 0,
    lostRevenue: 0,
  });
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]); // 🚩 New State

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };

        // 1. Fetch Sales Stats
        const statsRes = await axios.get(
          "http://localhost:5000/api/orders/stats",
          config
        );
        setStats(statsRes.data);

        // 2. Fetch Products & Filter for Low Stock
        const productRes = await axios.get(
          "http://localhost:5000/api/products",
          config
        );
        setTotalProducts(productRes.data.length);

        // 🔍 Filter: Stock < 5 logic
        const alerts = productRes.data.filter((p) => p.quantity < 5);
        setLowStockItems(alerts);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      icon: <PaidIcon />,
      color: "#1a73e8",
    },
    {
      label: "Active Orders",
      value: stats.orderCount,
      icon: <ShoppingCartIcon />,
      color: "#34a853",
    },
    {
      label: "Cancelled",
      value: stats.cancelledCount,
      icon: <CancelPresentationIcon />,
      color: "#d93025",
    },
    {
      label: "Total SKUs",
      value: totalProducts,
      icon: <InventoryIcon />,
      color: "#f9ab00",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "90vh", py: 5 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ mb: 4, color: "#202124" }}
        >
          Wholesale Mall Control Center
        </Typography>

        {/* 1. Statistics Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 4, border: "1px solid #dadce0" }}
              >
                <Avatar sx={{ bgcolor: card.color, mb: 1 }}>{card.icon}</Avatar>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={700}
                >
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={900}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* 2. 🚩 LOW STOCK ALERTS (Critical Section) */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "2px solid #ffc107", // Yellow border for attention
                bgcolor: "#fffef0",
                height: "100%",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <WarningAmberIcon sx={{ color: "#f9ab00" }} />
                <Typography variant="h6" fontWeight={800} color="#856404">
                  Inventory Alerts
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {lowStockItems.length > 0 ? (
                <List sx={{ width: "100%" }}>
                  {lowStockItems.map((item) => (
                    <ListItem key={item._id} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#d93025",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography fontWeight={700}>{item.name}</Typography>
                        }
                        secondary={`Only ${item.quantity} units left! Reorder soon.`}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "#fdecea",
                          color: "#d93025",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 700,
                        }}
                      >
                        LOW
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  ✅ All machinery parts are well-stocked.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* 3. BUSINESS INSIGHTS */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #dadce0",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Business Health
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Conversion Rate:{" "}
                  <strong>
                    {(
                      (stats.orderCount /
                        (stats.orderCount + stats.cancelledCount)) *
                        100 || 0
                    ).toFixed(1)}
                    %
                  </strong>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Total Potential Revenue Lost:{" "}
                  <strong style={{ color: "#d93025" }}>
                    ₹{stats.lostRevenue.toLocaleString()}
                  </strong>
                </Typography>
                <Box sx={{ mt: 4, p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                  <Typography
                    variant="caption"
                    color="#1a73e8"
                    fontWeight={700}
                  >
                    PRO TIP: High cancellation rate? Check if your parts
                    descriptions match the actual products.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
