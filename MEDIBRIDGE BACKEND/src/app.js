const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes")
const healthPassportRoutes = require("./routes/healthPassport.routes");
const healthPassportAccessRoutes = require("./routes/healthPassportAccess.routes");
const doctorRoutes = require("./routes/doctor.routes");
const consultationRoutes = require("./routes/consultation.routes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);


app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
/*
 * Middleware
 *
 * Allows Express to read JSON request bodies.
 */
app.use(express.json());

/*
 * Authentication routes
 *
 * All routes inside authRoutes will begin with:
 *
 * /api/auth
 */
app.use("/api/auth", authRoutes);

app.use("/api/health-passport", healthPassportRoutes);
app.use(
  "/api/health-passport",
  healthPassportAccessRoutes
);

const medicalInformationRoutes = require("./routes/medicalInformation.routes");
app.use(
  "/api/medical-information",
  medicalInformationRoutes
);

app.use(
  "/api/consultations",
  consultationRoutes
);
/*
 * Basic health-check route.
 *
 * This is only used to confirm that the server is running.
 */

const messageRoutes = require(
  "./routes/message.routes"
);

app.use(
  "/api/consultations",
  messageRoutes
);

const translationRoutes = require("./routes/translation.routes");

app.use("/api/translation", translationRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "MEDIBRIDGE API is running.",
  });
});

module.exports = app;
