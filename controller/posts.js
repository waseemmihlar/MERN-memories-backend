import express from "express";
import mongoose from "mongoose";
import PostMessage from "../models/postMessages.js";

export const getPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const Limit = 20;
    const start_index_of_page = (Number(page) - 1) * Limit;
    const numberOfPosts = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(Limit)
      .skip(start_index_of_page);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(numberOfPosts / Limit),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Query -> posts?search="nice" => get post from nice keyword
//params -> posts/123 -> get post from 123 id

// two are same (Query mostly use for pass string value)

export const getPostbySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i"); //i define ignore upper-case and lower-case search

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newpost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newpost.save();
    res.status(201).json(newpost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  //const {id}=req.params;

  // const {creator,title,message,tags,selectedFile}=req.body;
  const updatepost = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).send("The ID has no post");

  await PostMessage.findByIdAndUpdate(
    id,
    { ...updatepost, _id: id },
    { new: true }
  );
  res.json(updatepost);
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  //const {id}=req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).send("The ID has no post");

  await PostMessage.findByIdAndRemove(id);
  res.json({ message: "Content deleted successfully" });
};

export const likePost = async (req, res) => {
  //userId is  comming from middle-wear

  if (!req.userId) {
    res.json({ message: "Unouthorized Person" });
  }

  // const {id}=req.params;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    res.status(404).send("The ID has no post");

  const post = await PostMessage.findById(id);

  const user = post.likes.findIndex((id) => id === String(req.userId));

  if (user === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatepost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.json(updatepost);
};

export const commentPost = async (req, res) => {
  try {
    const { comment } = req.body;
    const { id } = req.params;

    const post = await PostMessage.findById(id);

    post.comments.push(comment);

    const updatePost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.json(updatePost);
  } catch (error) {
    res.json(erroe);
  }
};

export const userPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const allPost = await PostMessage.find();
    const userposts = allPost.filter((post) => post.creator === String(id));
    res.json(userposts);
  } catch (error) {
    console.log(error);
  }
};
