const Post = require("../models/postModel")
const path = require('path');
const mongoose = require('mongoose');

const arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const arr2 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
exports.submitPost = async (req, res) => {
    const currentDate = new Date();
    const formattedHours = currentDate.getHours() % 12 || 12; // Convert 0 to 12
    const period = currentDate.getHours() < 12 ? 'AM' : 'PM';
    const time = formattedHours + ":" + currentDate.getMinutes() + " " + period + " " + arr[currentDate.getDay()] + " " + currentDate.getDate() + " " + arr2[currentDate.getMonth()];
    console.log(req.body);
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
    }

    try {
        // Save the post to the database
        const post = new Post({ title, body, time });
        await post.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error while creating post' });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const blogs = await Post.find();
        // console.log(blogs);

        const len = await Post.countDocuments();
        const pairs = []

        if (len == 0) {
            res.render('myblogs', { layout:false,pairs });
        }
        blogs.forEach(blog => {
            // Create a pair object with title and body
            const pair = {
                title: blog.title,
                body: blog.body,
                id: blog.id,
                time: blog.time
            };
            console.log(pair);
            // Push the pair object into the pairs array
            pairs.push(pair);
        });
        // res.render('main', { pairs });
        res.render('myblogs', { layout: false, pairs });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send("Internal Server Error");
    }
};

// exports.pairs;
// Controller function to handle form submission for editing a post
exports.editPost = async (req, res) => {
    try {
        const currentDate = new Date();
        const formattedHours = currentDate.getHours() % 12 || 12; // Convert 0 to 12
        const period = currentDate.getHours() < 12 ? 'AM' : 'PM';
        // Extract post ID from request parameters
        const postId = req.params.id;
        const time = formattedHours + ":" + currentDate.getMinutes() + " " + period + " " + arr[currentDate.getDay()] + " " + currentDate.getDate() + " " + arr2[currentDate.getMonth()];

        // Extract updated post data from request body
        const { title, body } = req.body;

        // Validate input data
        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }

        // Find the post by ID and update it
        const updatedPost = await Post.findByIdAndUpdate(postId, { title, body, time }, { new: true });

        // Check if the post was found and updated successfully
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Send the updated post as JSON response
        res.redirect(`/posts/my/${postId}`);
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
    

exports.deletePost = async (req, res) => {
    try {
        let postIdString = req.params.id;
        console.log(postIdString)
        if (!postIdString) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }
        await Post.findByIdAndDelete(postIdString);
        res.redirect('/posts/my');
    } catch (error) {
        console.error("Error Deleting posts:", error);
        res.status(500).send("Internal Server Error");
    }
}

exports.createPost = (req, res) => {
    try {
        res.render('new', { layout: false });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Error while Creating Post "
        })
    }
}

exports.getMyPosts = async (req, res) => {
    try {
        const ID = req.params.id;
        const blog = await Post.findById(ID);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        const blogs = {
            title: blog.title,
            body: blog.body,
            time: blog.time,
            id: blog.id,
        };
        console.log(blogs);
        res.render('blogpost', { layout: false, blogs: blogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
