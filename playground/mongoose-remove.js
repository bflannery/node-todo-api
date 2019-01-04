const { ObjectID } = require('mongodb');

const { mongooes } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/Todo');
const { User } = require('./../server/models/User');

// Todo.deleteMany({}).then((result) => {
//   console.log(result);
// })


// Todo.findOneAndDelete
// Todo.findByIdAndDelete

// Todo.findOneAndDelete({_id: '5c2fcdc754efc7b500946ff2'}).then((todo) => {
//
// })
// Todo.findByIdAndRemove('5c2fccda54efc7b500946fdf').then((todo) => {
//   console.log(todo);
// });
