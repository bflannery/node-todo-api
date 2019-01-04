const { ObjectID } = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');

var app  = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// TODOS
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err)
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos, })
  }, (e) => {
    res.status(400).send(e);
  });
});


// TODO
app.post('/todos/:id', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err)
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    return res.send({todo, })
  }).catch((e) => res.status(400).send());
});

// USERS
app.post('/users', (req, res) => {
  var user = new User({
    email: req.body.email
  });
  user.save().then((doc) => {
    res.send(doc);
  }, (err) => {
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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = { app };
