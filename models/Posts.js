var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({

  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}] //ref refers to comment model
});

PostSchema.methods.upvote = function(cb){//cb is callback
  this.upvotes += 1;
  this.save(cb);
}

mongoose.model('Post', PostSchema);//to be able to access from other places
