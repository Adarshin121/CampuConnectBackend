const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:user@cluster0.ja6rsv3.mongodb.net/campusconnect?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected!')
  })
  .catch((err) => console.log(err))