const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/Todo');
const { User } = require('./../../models/User');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'brian@testing.com',
  password: 'passwordOne',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'sophie@testing.com',
  password: 'passwordTwo',
}]
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}]

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => (
    Todo.insertMany(todos)
  )).then(() => done());
};

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
