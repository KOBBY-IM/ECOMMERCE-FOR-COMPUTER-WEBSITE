// Import required modules
const express = require("express"); // Import the Express framework
const app = express(); // Create an instance of the Express application
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const jwt = require("jsonwebtoken"); // Import JWT for token generation and verification
const multer = require("multer"); // Import Multer for handling file uploads
const path = require("path"); // Import the path module for file path operations
const cors = require("cors"); // Import CORS for enabling cross-origin requests
const dotenv = require("dotenv"); // Import dotenv for environment variables
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

// Load environment variables from a .env file
dotenv.config();

// Import routes
const userRoute = require("./Routes/user"); // Import user routes
const authRoute = require("./Routes/auth"); // Import authentication routes
const productRoute = require("./Routes/product"); // Import product routes
const categoryRoute = require("./Routes/category"); // Import category routes
const orderRoute = require("./Routes/order"); // Import order routes
const cartRoute = require("./Routes/cart"); // Import cart routes
const reviewRoute = require("./Routes/review"); // Import review routes
const wishlistRoute = require("./Routes/wishlist"); // Import wishlist routes

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_COMM)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log(error);
    });

// Middleware setup
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable CORS

// Define routes
app.use("/api/auth", authRoute); // Use authentication routes
app.use("/api/users", userRoute); // Use user routes
app.use("/api/products", productRoute); // Use product routes
app.use("/api/category", categoryRoute); // Use category routes
app.use("/api/order", orderRoute); // Use order routes
app.use("/api/cart", cartRoute); // Use cart routes
app.use("/api/review", reviewRoute); // Use review routes
app.use("/api/wishlist", wishlistRoute); // Use wishlist routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Configure image storage using Multer
const storage = multer.diskStorage({
    destination: './upload/images', // Define the destination folder for uploaded images
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // Define the filename for uploaded images
    }
});
const upload = multer({ storage });

// Create an endpoint for serving uploaded images
app.use('/images', express.static('upload/images'));

// Define a POST endpoint for uploading images
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});
