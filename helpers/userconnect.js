var db = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { MongoCompatibilityError } = require("mongodb");
const { response } = require("../app");
module.exports = {
  doSignup: (userData) => {
    var statuss = null;
    return new Promise(async (resolve, reject) => {
      let emailId = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (!emailId) {
        userData.password = await bcrypt.hash(userData.password, 10);
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne({
            email: userData.email,
            fullName: userData.fullName,
            mobileNo: userData.mobileNo,
            password: userData.password,
          })
          .then((data) => {
            console.log(data);
            resolve({ statuss: true });
          });
      } else {
        resolve({ statuss: false });
      }
    });
  },
  doSignin: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log(status + "stat");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log(status + "h");
            resolve({ status: false });
          }
        });
      } else {
        resolve({ status: false });
      }
    });
  },
  userEdit: async (userData, emailData) => {
    console.log(emailData);
    try {
      await db
        .get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { email: emailData },
          {
            $set: {
              email: userData.email,
              fullName: userData.fullName,
              mobileNo: userData.mobileNo,
            },
          }
        );
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        let response = { user, status: true };
        return response;
      } else {
        return { status: false };
      }
    } catch (err) {
      return { status: false };
    }
  },

  changePassword: async (userData, emailData) => {
    try {
      userData.password = await bcrypt.hash(userData.password, 10);
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: emailData });
      if (user) {
        let statement = bcrypt.compare(userData.currentPassword, user.password);
        if (statement) {
          await db
            .get()
            .collection(collection.USER_COLLECTION)
            .updateOne(
              { email: emailData },
              { set: { password: userData.password } }
            );
        }
      }
    } catch (err) {}
  },
  getAllUser: async () => {
    let users = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .find()
      .toArray();
    return users;
  },
};
