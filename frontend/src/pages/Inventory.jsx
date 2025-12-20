import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  IconButton,
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import axios from "axios";

// Icons
import SearchIcon from "@mui/icons-material/SearchRounded";
import WarningIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import BuildIcon from "@mui/icons-material/BuildCircleRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShippingRounded";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🛡️ Get Role for Role-Based Access Control
  const userRole = localStorage.getItem("role")?.toLowerCase() || "guest";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    axios
      .get("http://localhost:5000/api/products", {
        headers: { "x-auth-token": token },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const sku = (product.sku || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || sku.includes(search);
  });

  const lowStockCount = products.filter((p) => p.quantity < 10).length;
  const pieData = [
    { name: "Optimal Stock", value: products.length - lowStockCount },
    { name: "Low Stock", value: lowStockCount },
  ];
  const COLORS = ["#34A853", "#EA4335"];
  const barData = products.sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this spare part?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { "x-auth-token": token },
        });
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} color="#202124">
              Inventory Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Real-time monitoring of machine spares and stock health.
            </Typography>
          </Box>
          {/* 🏷️ Ethical Badge for LinkedIn */}
          <Chip
            icon={<LocalShippingIcon sx={{ fontSize: "1rem !important" }} />}
            label="Wholesale Mall Standard"
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              color: "#1a73e8",
              borderColor: "#1a73e8",
            }}
          />
        </Box>

        {/* ANALYTICS PANEL */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{ borderRadius: 5, border: "1px solid #e0e0e0" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Spares Availability
                </Typography>
                <Box sx={{ height: 250, width: "100%" }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index]}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{ borderRadius: 5, border: "1px solid #e0e0e0" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Top 5 Critical Machine Parts (Quantity)
                </Typography>
                <Box sx={{ height: 250, width: "100%" }}>
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f3f4"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5f6368", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5f6368" }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8f9fa" }}
                        contentStyle={{ borderRadius: "12px", border: "none" }}
                      />
                      <Bar
                        dataKey="quantity"
                        fill="#1a73e8"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SEARCH BAR */}
        <Paper
          elevation={0}
          sx={{
            p: "4px 16px",
            mb: 4,
            display: "flex",
            alignItems: "center",
            borderRadius: 4,
            border: "1px solid #dadce0",
          }}
        >
          <SearchIcon sx={{ color: "#5f6368", mr: 1 }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search machine parts by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ disableUnderline: true, sx: { py: 1 } }}
          />
        </Paper>

        {/* MAIN TABLE */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 5,
            border: "1px solid #dadce0",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
              <TableRow>
                {[
                  "Machine Part",
                  "Part ID",
                  "Quantity",
                  "Unit Price",
                  "Total Value",
                  "Status",
                  userRole !== "staff" ? "Actions" : "",
                ].map((label, idx) => (
                  <TableCell
                    key={idx}
                    sx={{ fontWeight: 700, color: "#5f6368", py: 2.5 }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow
                  key={p._id}
                  hover
                  sx={{ "&:hover": { bgcolor: "#f8f9fa" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#e8f0fe",
                          color: "#1a73e8",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <BuildIcon fontSize="small" />
                      </Avatar>
                      <Typography fontWeight={600} color="#202124">
                        {p.name || "Unknown Part"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", color: "#5f6368" }}>
                    {p.sku || "N/A"}
                  </TableCell>
                  <TableCell fontWeight={500}>{p.quantity} units</TableCell>
                  <TableCell fontWeight={600}>₹{p.price}</TableCell>
                  <TableCell fontWeight={700} color="#1a73e8">
                    ₹{(p.price * p.quantity).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.quantity < 10 ? "Low Stock" : "Healthy"}
                      color={p.quantity < 10 ? "error" : "success"}
                      size="small"
                      sx={{ fontWeight: 800, borderRadius: 1.5, px: 1 }}
                      icon={
                        p.quantity < 10 ? (
                          <WarningIcon style={{ fontSize: 16 }} />
                        ) : (
                          <CheckCircleIcon style={{ fontSize: 16 }} />
                        )
                      }
                    />
                  </TableCell>

                  {/* 🛡️ ROLE CHECK FOR DELETE BUTTON */}
                  {userRole !== "staff" && (
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(p._id)}
                        sx={{
                          color: "#d93025",
                          "&:hover": { bgcolor: "#fce8e6" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default Inventory;
