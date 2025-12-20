import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CancelIcon from "@mui/icons-material/Cancel";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: { "x-auth-token": token },
        }
      );
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch failed", err);
      setLoading(false);
    }
  };

  // 🚀 CANCEL LOGIC: Hit the backend PUT route
  const handleCancel = async (orderId) => {
    if (!window.confirm("Bhai, pakka cancel karna hai?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/cancel/${orderId}`,
        {},
        {
          headers: { "x-auth-token": token },
        }
      );

      setMsg("Order Cancelled & Stock Restored!");
      fetchOrders(); // Refresh the list to show updated status
    } catch (err) {
      alert(err.response?.data?.msg || "Cancellation failed");
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ minHeight: "100vh", py: 8, bgcolor: "#f7f9fc" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <ReceiptLongIcon sx={{ fontSize: 40, color: "#1a237e" }} />
            <Typography variant="h3" fontWeight={900} color="#1a237e">
              My Orders
            </Typography>
          </Stack>
          <Typography variant="h6" color="text.secondary">
            Manage your machinery spare orders
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {orders.length > 0 ? (
            orders.map((order) => {
              const item = order.items && order.items[0] ? order.items[0] : {};
              const isCancelled = order.status === "Cancelled";

              return (
                <Grid item xs={12} key={order._id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 6,
                      border: "1px solid #dadce0",
                      bgcolor: isCancelled ? "#fafafa" : "#ffffff",
                      opacity: isCancelled ? 0.8 : 1,
                      transition: "0.3s",
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{
                            textDecoration: isCancelled
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {item.name || "Machinery Part"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {order.quantity} units
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          fontWeight={900}
                        >
                          STATUS
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={order.status}
                            color={isCancelled ? "error" : "success"}
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          fontWeight={900}
                        >
                          TOTAL PAID
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight={900}
                          color={isCancelled ? "text.disabled" : "#1a237e"}
                        >
                          ₹{order.totalAmount?.toLocaleString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
                        {/* 🌟 Conditional Button: Sirf tab dikhega jab order cancelled NAHI hai */}
                        {!isCancelled && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleCancel(order._id)}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: "none",
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Typography variant="h6" sx={{ ml: 2 }}>
              Koi orders nahi hain bhai.
            </Typography>
          )}
        </Grid>
      </Container>

      <Snackbar open={!!msg} autoHideDuration={3000} onClose={() => setMsg("")}>
        <Alert severity="warning" sx={{ width: "100%", fontWeight: 700 }}>
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderHistory;
