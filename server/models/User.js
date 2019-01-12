const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//User Schema
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// Methods
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
};

// Insetances
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => token)
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.updateOne({
    $pull: {
      tokens: {
        token,
      }
    }
  })
}

// statics
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.recject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        return res ? resolve(user) : reject()
      });
    })
  });
};

// Hash and Salt
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    var userPassword = user.password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// User Model
var User = mongoose.model('User', UserSchema);

module.exports = { User };
