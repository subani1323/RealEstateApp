// middleware/validateEnv.js

module.exports = function validateEnv(requiredVars = []) {
  return (req, res, next) => {
    const missingVars = requiredVars.filter((v) => !process.env[v]);

    if (missingVars.length > 0) {
      console.error(
        `❌ Missing environment variables: ${missingVars.join(", ")}`
      );
      return res.status(500).json({
        error: "Server configuration error. Missing environment variables.",
      });
    }
    next();
  };
};
