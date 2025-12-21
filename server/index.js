require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://trip-flux-kuo0p9vku-abhisheks-projects-ea51422e.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/auth");
const aiAssistantRoutes = require("./routes/aiAssistant");
const travelLogsRoutes = require("./routes/travelLogs");
const expensesRoutes = require("./routes/expenses");
const mediaRoutes = require("./routes/media");

app.use("/api/auth", authRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/travelLogs", travelLogsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/media", mediaRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
