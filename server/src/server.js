import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const app = createApp();
const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
