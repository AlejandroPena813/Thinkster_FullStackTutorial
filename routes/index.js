var express = require('express');//establish routes for perstistent data
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/////////////
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.get('/posts', function(req, res, next){//get all posts,req all req to server, res to respond
  Post.find(function(err, posts) {
    if(err) { next(err); }

    res.json(posts);
  })
});

router.post('/posts', function(req, res, next){
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err) {return next(err); }

    res.json(post);
  });
});

//post is loaded before viewing page, automatically load object when in url
router.param('post', function(req,res,next,id) {
  var query = Post.findById(id);//passed as parameter

  query.exec(function (err, post){
    if(err) { return next(err); }
    if(!post) {return next(new Error("can't find book")); }

    req.post = post;
    return next();

  })
});

//same as above but for comments
router.param('comment', function(req,res,next,id) {
  var query = Comment.findById(id);//passed as parameter

  query.exec(function (err, comment){
    if(err) { return next(err); }
    if(!comment) {return next(new Error("can't find book issued")); }

    req.comment = comment;
    return next();

  })
});

//route for returning a single post
router.get('/posts/:post', function(req, res){
  //populating all comments
  req.post.populate('comments', function(err, post){
    res.json(req.post);
  });
});

//to handle upvotes
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err,post){
    if(err) {return next(err); }

    res.json(post);
  });
});



//
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

//same above but for comment upvote
router.put('/posts/:post/comments/:comments/upvote', function(req, res, next) {
  req.comment.upvote(function(err,comment){
    if(err) {return next(err); }

    res.json(comment);
  });
});
//////////
module.exports = router;
