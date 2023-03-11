var db = require("../config/connection");
var collection = require("../config/collection");
const { MongoCompatibilityError } = require("mongodb");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const { ObjectId } = require("mongodb");

module.exports = {
  doSignIn: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        // bcrypt.compare(userData.password, user.password).then((status) => {
        console.log(userData.password);
        console.log(user.password);
        console.log(user);
        if (userData.password === user.password) {
          //   if (status) {
          response.admin = user;
          response.status = true;
          resolve(response);
        } else {
          resolve({ status: false });
        }
        // });
      } else {
        resolve({ status: false });
      }
    });
  },

  deleteUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .deleteOne({ _id: new ObjectId(userId) }); // add the `new` keyword here
        console.log(response);
        resolve({ status: true });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  updateUser: (userId, userData) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              email: userData.email,
              fullName: userData.fullName,
              mobileNo: userData.mobileNo,
            },
          }
        )
        .then((data) => {
          resolve({ status: true });
        });
    });
  },
  getUser: async (userId) => {
    let user = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: new ObjectId(userId) });
    if (user) {
      let response = { user, status: true };
      return response;
    } else {
      return { status: false };
    }
  },
};
