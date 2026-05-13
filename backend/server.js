const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "..", "mobile", "data", "test.json");

// GET all items
app.get("/items", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

// POST a new item
app.post("/items", (req, res) => {
  const { name, quantity, expiry } = req.body;

  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const newItem = { id: Date.now(), name, expiry, quantity };
  data.push(newItem);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, item: newItem });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
