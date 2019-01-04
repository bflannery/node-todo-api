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
  db.collection('Users').findOneAndUpdate({
    _id: ObjectID('5c2f69d254efc7ad8273e6b5')
  }, {
    $set: {
      name: 'Brian'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result => {
    console.log(result);
  }));

  // client.close();
});
