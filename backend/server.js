import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import pool from './db.js';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express()

//Middleware
app.use(cors());
//Body parser middleware
app.use(express.json()); //req.body

//Routes
app.use('/api/users', userRoutes);


//FOR NOW probably change later
app.get('/', (req, res) => res.send('Server is ready'));


//Error Handler
app.use(notFound);
app.use(errorHandler);






//Will import a controller later
//But for now heres an example
// app.post('/exampleroutechangelater', async (req, res) => {
//     try {
//         //Later extract all the neccessary values from req.body
//         const newUser = await pool.query(
//             'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3)',
//             [username, email, hashedPassword]
//         );

//         //Send a response later. such such res.status.json
//         res.status(201).json();
//     } catch (error) {
//         //Add Error Handling Here
//         console.error(error);
//         //unique constraint error handling
//         if(error.code = '23505') {
//             res.status(400).json();
//         } else {
//             res.status(500).json();
//         }
//     }
// });






//BOOK Route Later
//This is for fetching like a singular books data
//But my idea was to basically check if the book is already in the users books database if they have an account
//if it is then load the book data from the database first
//if not then just fetch from the api



app.listen(port, () => console.log(`Server started on port ${port}`));