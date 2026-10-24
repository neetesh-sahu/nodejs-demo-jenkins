const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Home page is served from public/index.html

// Simple JSON API
app.get("/api/hello", (req, res) => {
  const name = req.query.name || "World";
  res.json({ message: `Hello, ${name}!` });
});

// App and server info
app.get("/api/info", (req, res) => {
  res.json({
    app: "Elevate Labs Task-1",
    node: process.version,
    hostname: os.hostname(),
    uptimeSeconds: Math.round(process.uptime()),
    time: new Date().toISOString(),
  });
});

// Health check (useful later for Docker / Kubernetes / CI-CD)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;