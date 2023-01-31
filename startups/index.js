const mongodb = require("./mongodb");

module.exports = () => {
  // databases
  mongodb.connect();

  // seed database
  import("./seeder.js").then((seeder) => {
    seeder.default();
  });
};
