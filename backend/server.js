import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';

const port = process.env.PORT || 5000;

const app = express();

//Middleware
app.use(cors());
app.use(cookieParser());
//Body parser middleware
app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: true}));

//Routes
app.use('/api/users', userRoutes);          //For user login
app.use('/api/books', bookRoutes);          //For adding, updating or removing books from reading list
app.use('/api/explore', exploreRoutes);     //For the explore page

//FOR NOW probably change later
app.get('/', (req, res) => res.send('Server is ready'));


//Error Handler
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`Server started on port ${port}`));