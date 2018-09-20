const mongoose = require('mongoose');
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.set("useCreateIndex", true);
mongoose.connect(
  "mongodb://localhost/warblerDB",
  {
    keepAlive: true,
    useNewUrlParser: true
  }
);

module.exports.User = require("./user");
module.exports.Message = require("./message");
