const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
},(err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.')
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  // deleteMany
  db.collection('Users').deleteMany({ name: 'Brian' }).then((result => {
    console.log(result);
  }));

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Eat Lunch' }).then((result => {
  //   console.log(result);
  // }));

  // findOneAndDelete
  db.collection('Users').findOneAndDelete({ _id: ObjectID("5c2e3496929c6ba9dba9985d") }).then((result => {
    console.log(result);
  }));
  // client.close();
});
