require('./config/config');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');

var app  = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// TODOS
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos, })
  }, (e) => {
    res.status(400).send(e);
  });
});

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


// TODO
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndDelete(id).then((todo) => (
    !todo
     ? res.status(404).send()
     : res.send({todo, })
   )).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
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

  Todo.findOneAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo, });
  }).catch((e) => {
    res.status(400).send();
  })

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
