const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const logger = require("./app/core/logger/logger");
const errorHandler = require("./app/core/error-handler");
const coreRouter = require("./app/core/core-router");
const userRouter = require("./app/core/user/user-router");
const careerRouter = require("./app/core/career/career-router");
const personalityRouter = require("./app/core/personality/personality-router");
const paymentRouter = require("./app/core/payment/payment-router");
const authenticateM = require("./app/middlewares/authentication-middleware");

const app = express();
const port = process.env.PORT || 3002;
const versionPath = "/api/v1";
const isDev = process.env.NODE_ENV === "dev";

// ✅ CORS setup
const corsOptions = {
  origin: "http://127.0.0.1:4200", // Angular local app URL
  credentials: true,
};

if (isDev) {
  app.use(cors(corsOptions));
}

// ✅ File upload and cookie parsing
app.use(fileUpload());
app.use(cookieParser());

// ✅ Logging
app.use(logger.express);

// ✅ Security headers
app.use("*", (req, res, next) => {
  res.set("X-Frame-Options", "sameorigin");
  res.set("Cache-control", "no-cache");
  res.set("X-XSS-Protection", "1; mode=block");
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Strict-Transport-Security", "max-age=7776000");
  res.set("Referrer-Policy", "same-origin");
  res.removeHeader("X-Powered-By");
  next();
});

// ✅ Set security headers for static assets
const staticHeaders = {
  setHeaders: function (res, path, stat) {
    res.set("X-Frame-Options", "sameorigin");
    res.set("Cache-control", "no-cache");
    res.set("X-XSS-Protection", "1; mode=block");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Strict-Transport-Security", "max-age=7776000");
    res.set("Referrer-Policy", "same-origin");
    res.removeHeader("X-Powered-By");
  },
};

// ✅ Parse JSON body
app.use(bodyParser.json());

// ✅ Authentication middleware
app.use(authenticateM());

// ✅ API routes
app.use(versionPath, coreRouter);
app.use(versionPath, userRouter);
app.use(versionPath, careerRouter);
app.use(versionPath, personalityRouter);
app.use(versionPath, paymentRouter);

// ✅ Error handling
app.use(errorHandler);

// ✅ Serve frontend from original build path
const frontendPath = path.join(__dirname, "../../frontend/dist/careerlogy_app");

app.use(express.static(frontendPath, staticHeaders));

// ✅ Fallback route for SPA (index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start server
app.listen(port, () => {
  logger.debug.info(`Server listening on port: ${port}`);
});
