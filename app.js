require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose= require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Successfully conected to the database.");
});

const postSchema = mongoose.Schema({
  title : String,
  content : String 
});

const Post = mongoose.model("post", postSchema);

// Testing database insertion 
// const test = new Post( {title:"Test post",content: "Test content"});
// test.save();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

let posts=[];

app.get("/",function(req,res){
  Post.find().then((allPosts)=>{
    res.render("home",{startingContent: homeStartingContent , posts: allPosts});
  });

  // console.log(posts);
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent: contactContent});
});

//////////////////////////////////compose route//////////////////////////////////

app.route("/compose")
.get(function(req,res){
  res.render("compose");
})
.post(function(req,res){
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  let post = new Post({
    title: postTitle,
    content : postBody
  });

  post.save().then(()=>{
    console.log("New Post added");
    res.redirect("/");
  });
});

app.get("/posts/:title", function(req,res){
  let postId = req.params.title;
  Post.findOne({_id : postId }).then((foundPost)=>{
    res.render("post",{ postTitle: foundPost.title, postBody: foundPost.content});
  })
});














app.listen(3000, function() {
  console.log("Server started on port 3000");
});
