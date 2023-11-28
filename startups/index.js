const mongodb = require("./mongodb");

module.exports = async () => {
  // databases
  await mongodb.connect();

  // seed database
  import("./seeder.js").then((seeder) => {
    seeder.default();
  });
};
