const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;

    fs.appendFile(filename, log, (err) => {
      if (err) console.error("Logging error:", err);
    });

    next();
  };
}

module.exports = {
  logReqRes,
};
