// Load environment variables from .env file
require("dotenv").config();

// Enhance Express to handle async/await errors
require("express-async-errors");

// Extra security packages
const helmet = require("helmet"); // Set various HTTP headers for security
const cors = require("cors"); // Enable Cross-Origin Resource Sharing
const xss = require("xss-clean"); // Protect against cross-site scripting (XSS) attacks
const rateLimiter = require("express-rate-limit"); // Implement rate limiting for requests

// Swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml"); // Load Swagger documentation from YAML file

const express = require("express");
const app = express(); // Create an Express app

const connectDB = require("./db/connect"); // Database connection function
const authenticateUser = require("./middleware/authentication"); // Authentication middleware

// Routers
const authRouter = require("./routes/auth"); // Authentication routes
const userRouter = require("./routes/user"); // User routes
const accountRouter = require("./routes/account"); // Account routes

// Error handler middleware
const notFoundMiddleware = require("./middleware/not-found"); // Handle 404 Not Found errors
const errorHandlerMiddleware = require("./middleware/error-handler"); // Handle general errors

// Set trust proxy and apply rate limiting
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  })
);

// Parse JSON requests, apply security middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Root route
app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.use("/api/v1/auth", authRouter); //
app.use("/api/v1/users", authenticateUser, userRouter); // Authenticated routes
app.use("/api/v1/account", authenticateUser, accountRouter); // Authenticated routes

// Middleware for handling 404 Not Found errors
app.use(notFoundMiddleware);

// Middleware for handling general errors
app.use(errorHandlerMiddleware);

// Define port, defaulting to 5000 if not specified
const port = process.env.PORT || 5000;

// Start the server
const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);

    // Listen on the specified port
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

// Call the start function to initiate the server startup
start();
