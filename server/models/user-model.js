const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

//instance methods
//檢測用戶組
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};
//比對密碼
userSchema.methods.comparePassword = async function (password, cb) {
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

//mongoose middlewares
//若使用者為新用戶或正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
  //this代表mongoDB內的document，此處不能使用arrow func expression，否則會抓不到this
  //其有isNew這個method可以檢測是否為新資料
  if (this.isNew || this.isModified("password")) {
    //密碼雜湊
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
