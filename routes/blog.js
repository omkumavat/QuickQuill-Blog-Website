const express = require('express');
const router = express.Router();
const Post=require('../models/postModel');
const mongoose=require('mongoose');

// Import Controller 
const {createComment,submitComment, getComments} = require("../controllers/commentController");
const {createPost,getAllPosts,submitPost,deletePost, editPost,getMyPosts} = require("../controllers/postController");
const {likePost,unlikePost,createLike,createUnLike} = require("../controllers/likeController");

// Mapping Create
router.get("/posts/comment/:id",createComment);
router.post("/posts/comment/submit/:id",submitComment)
router.get('/posts/comments/:id',getComments);

router.post("/posts/submit",submitPost)
router.get("/posts/my",getAllPosts)
router.get("/posts/my/:id",getMyPosts)
router.get("/posts/create",createPost)
router.post("/posts/:id",deletePost);
router.get("/posts/edit/:id", async(req,res) => {
    const ID=req.params.id;
    const blog = await Post.findById(ID);
    console.log(blog)
    const title=blog.title;
    const body=blog.body;
    console.log(title,body)
    res.render('edit',{layout:false,title,body,ID});
});
router.post("/posts/edit/:id",editPost);

router.post("/like/submit",likePost)
router.post("/unlike/submit",unlikePost)
router.get("/like/create",createLike);
router.get("/unlike/create",createUnLike);

// Export Controller
module.exports = router;