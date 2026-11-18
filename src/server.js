require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");


const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);



const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
  });
};

startServer();