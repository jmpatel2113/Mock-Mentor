/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://Mock%20Mentor%20DB_owner:9y6MBCiomWLN@ep-dark-hall-a45nh4ag.us-east-1.aws.neon.tech/Mock-Mentor-DB?sslmode=require',
    }
  };
  