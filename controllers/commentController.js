// import model 
const Post = require("../models/postModel");
const CircularJSON = require('circular-json');
const Comment = require("../models/commentModel");
const { response } = require("express");
const path = require('path');
// const {pairs}=require('../controllers/postController');

// business Logic
exports.submitComment = async (req, res) => {
    try {
        // fetch data from request body 
        const ID = req.params.id;
        const { user, body } = req.body;

        // create comment object
        const comment = new Comment({
            post: ID,
            user: user,
            body: body,
        })

        // save the new comment object into the db 
        const savedComment = await comment.save();

        // Find the Post By Id and the new comment to its comment array 
        const updatedPost = await Post.findByIdAndUpdate(ID, { $push: { comments: savedComment._id } },
            { new: true })
            .populate("comments") //Populates the comment array with the comments document
            .exec();

        res.redirect(`/posts/my/${ID}`);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Error while submmiting comment",
        })
    }
}

exports.createComment = (req, res) => {
    try {
        const ID = req.params.id;
        res.render('comment', {layout:false, ID });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Error while Creating comment "
        })
    }
}

exports.getComments = async (req, res) => {
    try {
        const ID = req.params.id;
        const [comments, blog] = await Promise.all([
            Comment.find({ post: ID }),
            Post.findById(ID)
        ]);

        if (!blog) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const pairs = {
            title: blog.title,
            body: blog.body,
            id: blog.id,
            time: blog.time,
            comments: comments.map(comment => ({
                user: comment.user,
                userbody: comment.body
            }))
        };

        console.log(pairs);

        res.render('blogpost2', { layout: false, pairs });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Error while getting comments"
        });
    }
};
