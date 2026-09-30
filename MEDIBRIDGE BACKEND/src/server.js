require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test PostgreSQL connection
    await sequelize.authenticate();

    console.log("PostgreSQL connection established successfully.");

    // Create/update database tables
    await sequelize.sync();

    console.log("Database models synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:");
    console.error(error);

    process.exit(1);
  }
};

startServer();