var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({

  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  post: {type: mongoose.Schema.Types.ObjectId, ref:'Post'} //ref refers to post model, not an array unlike posts schema
});

CommentSchema.methods.upvote = function(cb){//cb is callback
  this.upvotes += 1;
  this.save(cb);
}

mongoose.model('Comment', CommentSchema);//declare as comment schema to be able to access from other places
