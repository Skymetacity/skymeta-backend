import { Sequelize } from "sequelize";
import config from "./config.json" with { type: "json" };

// Use the config for the 'development' environment
const { username, password, database, host, dialect } = config.development;

// Create a Sequelize instance
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: console.log,
  port: 17589,
  dialectOptions: {
    connectTimeout: 60000,
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // Import models AFTER sequelize is initialized
    const { models } = await import("../models/index.js");

    // Fetch some users to test if data exists
    const users = await models.User.findAll({ limit: 5 });
    console.log("Users:", users);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the function
initializeDatabase();

export default sequelize;
