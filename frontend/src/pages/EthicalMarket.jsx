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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; // 🌟 Admin Icon

const EthicalMarket = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);

  // 🌟 Role check logic
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchBulkDeals();
  }, []);

  const fetchBulkDeals = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };
      const res = await axios.get("http://localhost:5000/api/products", config);
      setProducts(res.data.filter((p) => p.quantity >= 5).slice(0, 6));
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders",
        { productId: selectedProduct._id, address, quantity: 5 },
        { headers: { "x-auth-token": token } }
      );
      setSuccess(true);
      setOpenModal(false);
      setAddress("");
    } catch (err) {
      alert("Order failed!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        background:
          "radial-gradient(at 0% 0%, #e0f2fe 0, transparent 50%), radial-gradient(at 100% 100%, #fafafa 0, transparent 50%)",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <GroupsIcon sx={{ fontSize: 45, color: "#0284c7" }} />
            <Typography variant="h3" fontWeight={900} color="#1e3a8a">
              Bulk Impact Deals
            </Typography>
          </Stack>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 2, maxWidth: 800 }}
          >
            This is a Special section where Buyers can avail exclusive bulk
            deals on machinery spares. By purchasing in bulk, you not only save
            costs but also contribute to reducing packaging waste and lowering
            carbon emissions associated with multiple shipments.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {products.map((p) => {
            const retailPrice = p.price;
            const bulkPrice = p.price * 0.7;
            const totalSavings = (retailPrice - bulkPrice) * 5;

            return (
              <Grid item xs={12} md={6} lg={4} key={p._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 7,
                    bgcolor: "#ffffff",
                    border: "1px solid #dadce0",
                    transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(30,58,138,0.1)",
                      borderColor: "#0284c7",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Typography variant="h5" fontWeight={900} color="#202124">
                      {p.name}
                    </Typography>
                    <Chip
                      label="MIN 5 UNITS"
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 800, borderRadius: 1 }}
                    />
                  </Stack>

                  <Box
                    sx={{
                      my: 3,
                      p: 2,
                      bgcolor: "#f0f9ff",
                      borderRadius: 4,
                      border: "1px solid #bae6fd",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <LocalOfferIcon sx={{ fontSize: 18, color: "#0369a1" }} />
                      <Typography
                        variant="body2"
                        fontWeight={800}
                        color="#0369a1"
                      >
                        WHOLESALE BENEFIT
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="#475569">
                      Is bulk deal se aap total **₹
                      {totalSavings.toLocaleString()}** bacha rahe hain.
                    </Typography>
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontWeight: 700 }}
                    >
                      RETAIL: ₹{retailPrice.toLocaleString()}/unit
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="baseline"
                      sx={{ mb: 3 }}
                    >
                      <Typography variant="h4" fontWeight={900} color="#1e3a8a">
                        ₹{bulkPrice.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        / unit (Bulk)
                      </Typography>
                    </Stack>

                    {/* 🌟 ROLE-BASED BUTTON RENDERING 🌟 */}
                    {userRole === "buyer" ? (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => {
                          setSelectedProduct(p);
                          setOpenModal(true);
                        }}
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 800,
                          textTransform: "none",
                          bgcolor: "#0284c7",
                          "&:hover": { bgcolor: "#0369a1" },
                          boxShadow: "none",
                        }}
                      >
                        Place Bulk Order
                      </Button>
                    ) : (
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#f8f9fa",
                          borderRadius: 3,
                          border: "1px dashed #cbd5e1",
                          textAlign: "center",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <AdminPanelSettingsIcon
                            sx={{ color: "text.secondary", fontSize: 20 }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color="text.secondary"
                          >
                            Admin View Mode
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.disabled">
                          Buyers can order this deal at 30% off.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* 🏠 Modal Logic Same */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{ sx: { borderRadius: 6, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>
          Bulk Shipping Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ mb: 1, color: "text.primary", fontWeight: 700 }}
          >
            Ordering: 5 Units of {selectedProduct?.name}
          </Typography>
          <TextField
            fullWidth
            label="Factory/Warehouse Address"
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            onClick={handleOrder}
            variant="contained"
            sx={{ borderRadius: 3, px: 4, bgcolor: "#0284c7" }}
          >
            Confirm Bulk Order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Bhai, Bulk Order Success! Marketplace updated.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EthicalMarket;
