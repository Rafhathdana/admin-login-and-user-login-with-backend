const MongoClient = require("mongodb").MongoClient;
const state = {
  db: null,
};
module.exports = {
  connect: function (done) {
    const Mongo = MongoClient.connect("mongodb://localhost:27017");
    Mongo.then(async (client) => {
      state.db = client.db("dana");
      done();
    }).catch((err) => {
      console.log("Mongo error:" + err);
    });
  },
  get: function () {
    return state.db;
  },
};
