import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Chip,
  LinearProgress,
  Paper,
  CircularProgress,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";

const SmartRestock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/products", {
        headers: { "x-auth-token": token },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const runLogicEngine = (p) => {
    // 1. Stock Criticality (50% weight) - Higher if stock is low
    const criticality = Math.max(0, Math.min(100, 100 - p.quantity * 3));

    // 2. Component Wear Rate (30% weight) - Logic based on part names
    const highWearKeywords = /pump|valve|motor|gear|belt|bearing/i;
    const wearRate = highWearKeywords.test(p.name) ? 90 : 60;

    // 3. Financial Ease (20% weight) - Higher if item is cheaper (less risk)
    const financialEase = p.price < 2000 ? 95 : p.price < 10000 ? 70 : 40;

    // Dynamic Weighted Score
    const finalScore = criticality * 0.5 + wearRate * 0.3 + financialEase * 0.2;

    let status = { label: "OPTIMAL", color: "success" };
    if (finalScore >= 75) status = { label: "REORDER", color: "error" };
    else if (finalScore >= 50) status = { label: "WATCH", color: "warning" };

    return { finalScore, status, criticality, wearRate, financialEase };
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          <PsychologyIcon color="primary" /> Restock Logic Engine
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Algorithmic procurement suggestions based on real-time stock and part
          criticality.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            bgcolor: "#e3f2fd",
            border: "1px solid #bbdefb",
            borderRadius: 3,
          }}
        >
          <Typography variant="body2" color="primary.dark">
            <b>Logic Formula:</b> (Criticality × 0.5) + (Wear Rate × 0.3) +
            (Financial Ease × 0.2). Scores are calculated dynamically from
            backend data.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {products.map((p) => {
            const result = runLogicEngine(p);
            return (
              <Grid item xs={12} md={6} lg={4} key={p._id}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 5,
                    border: "1px solid #dadce0",
                    boxShadow: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      noWrap
                      sx={{ maxWidth: "65%" }}
                    >
                      {p.name}
                    </Typography>
                    <Chip
                      label={result.status.label}
                      color={result.status.color}
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>

                  <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
                    {result.finalScore.toFixed(0)}
                    <span style={{ fontSize: "1rem", color: "#5f6368" }}>
                      /100
                    </span>
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <ScoreBar
                      label="Stock Criticality"
                      value={result.criticality}
                      color="#4285F4"
                    />
                    <ScoreBar
                      label="Wear Rate"
                      value={result.wearRate}
                      color="#34A853"
                    />
                    <ScoreBar
                      label="Financial Ease"
                      value={result.financialEase}
                      color="#FBBC04"
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid #f1f3f4",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="caption">
                      Stock: {p.quantity}
                    </Typography>
                    <Typography variant="caption">Price: ₹{p.price}</Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

const ScoreBar = ({ label, value, color }) => (
  <Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={600}>
        {value.toFixed(0)}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 6,
        borderRadius: 5,
        bgcolor: "#f0f2f5",
        "& .MuiLinearProgress-bar": { bgcolor: color },
      }}
    />
  </Box>
);

export default SmartRestock;
