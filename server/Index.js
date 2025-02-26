import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import nodemailer from 'nodemailer';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
//import AuthRouter from './Routes/AuthRouter.js';
import UserModel from './Models/User.js';
import SearchHistory from './Models/History.models.js';
import FeedbackSchema from './Models/Feedback.js';
//import { v2 as cloudinaryV2 } from 'cloudinary';
//import verifyToken from './middlewares/verifyToken.js';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
//import DataUriParser from 'datauri/parser';
import path from 'path';
import cron from 'node-cron';
import crypto from 'crypto';
import './Models/db.js';
import pkg from 'cloudinary';
const { v2: cloudinaryV2 } = pkg;
// Initialize environment variables
dotenv.config();


// Initialize express app
const app = express();
app.use(express.json());
//app.use('/auth' ,AuthRouter);

// Middleware configurations
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());