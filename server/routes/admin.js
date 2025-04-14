const express = require('express');
const router = express.Router();
const UserLoginStats = require('../model/UserLoginStats');
const BlogPost = require('../model/BlogPost');
const Feedback = require('../model/Feedback');
const { verifyAdmin } = require('../Middleware/auth');
const jwt = require('jsonwebtoken');

// Track user login
router.post('/track-login', async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      return res.status(200).json({ success: true, message: 'Admin login not tracked' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await UserLoginStats.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    console.log("Updated stats for non-admin user:", stats);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Track login error:", error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get login statistics
router.get('/login-stats', verifyAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await UserLoginStats.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 });
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Blog Post CRUD
router.post('/blog-posts', verifyAdmin, async (req, res) => {
  try {
    const { title, content, category, tags, isPublished = true } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }
    const newPost = new BlogPost({
      title,
      content,
      category,
      tags: tags || [],
      isPublished,
      postedBy: req.user.id,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.get('/blog-posts/admin', verifyAdmin, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts (admin):', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

router.get('/blog-posts', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts (public):', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

router.get('/blog-posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, isPublished: true })
      .populate('postedBy', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Post not found or not published' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

router.get('/blog-posts/admin/:id', verifyAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('postedBy', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post (admin):', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

router.put('/blog-posts/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, content, category, tags, isPublished } = req.body;
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, category, tags: tags || [], isPublished, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

router.delete('/blog-posts/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Feedback routes
router.post('/feedback', async (req, res) => {
  try {
    const { content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-123');
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (!content) {
      return res.status(400).json({ error: 'Feedback content is required' });
    }
    const email = decoded.email;
    if (!email) {
      console.error('No email found in token:', decoded);
      return res.status(401).json({ error: 'User email not found in token' });
    }
    const newFeedback = new Feedback({
      content,
      email,
      username: decoded.username || 'User',
    });
    await newFeedback.save();
    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

router.get('/feedback', verifyAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    await Feedback.updateMany({ isNew: true }, { $set: { isNew: false } });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

router.delete('/feedback/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

router.put('/feedback/:id/bookmark', verifyAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    feedback.isBookmarked = !feedback.isBookmarked;
    feedback.isNew = false;
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    console.error('Error bookmarking feedback:', error);
    res.status(500).json({ error: 'Failed to bookmark feedback' });
  }
});

router.get('/feedback/new-count', verifyAdmin, async (req, res) => {
  try {
    const count = await Feedback.countDocuments({ isNew: true });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching new feedback count:', error);
    res.status(500).json({ error: 'Failed to fetch new feedback count' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;