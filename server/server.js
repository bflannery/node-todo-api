require('./config/config');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');
var { authenticate } = require('./middleware/authenticate');

// Initialize Express
var app  = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// TODOS
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({ todos, })
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user.id
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err)
  });
});


// TODO
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => (
    !todo
     ? res.status(404).send()
     : res.send({todo, })
  )).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => (
    !todo
     ? res.status(404).send()
     : res.send({todo, })
   )).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }


  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  const query = {
    _id:id,
    _creator: req.user._id
  }
  // findOneAndUpdate
  Todo.findOneAndUpdate(query, body, { new: true }).then((todo) => (
    !todo
     ? res.status(404).send()
     : res.send({todo, })
  )).catch((e) => {
    res.status(400).send();
  })
});

// USERS
app.post('/users', (req, res) => {
  console.log({req, res})
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body)

  user.save().then(() => (
    user.generateAuthToken()
)).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((err) => {
    res.status(400).send(err)
  });
});

app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.send({ users, })
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch(() => {
    res.status(400).send()
  })
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = { app };
