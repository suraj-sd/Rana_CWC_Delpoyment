require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 1155;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => {
      console.error("❌ DB Error", err);
      process.exit(1);
    });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
