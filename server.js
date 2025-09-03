const express = require("express")
const connectDB = require("./config/db")
const cartRoutes = require("./routes/cart.routes")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 7463

app.use(express.json())

connectDB()

app.use("/api/cart", cartRoutes)

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, ()=> {
    console.log(`Cart micro-service is running on port ${PORT}`)
})