const { ObjectID } = require('mongodb');

const { mongooes } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/Todo');
const { User } = require('./../server/models/User');

var id = '5c2f8b3a760294b6707e0200'

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todoId) => {
//   if (!todoId) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todoId);
// }).catch((e) => console.log(e));


User.findById(id).then((userId) => {
  if (!userId) {
    return console.log('Id not found');
  }
  console.log('User By Id', userId);
}).catch((e) => console.log(e));
