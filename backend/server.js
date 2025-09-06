import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import cookieParser from 'cookie-parser';
import cors from 'cors';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import syncNYTBestSellers from './sync/nytSync.js';
import { fileURLToPath } from 'url';  // ← Missing import
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Admin endpoint to trigger NYT sync
app.post('/api/admin/sync-nyt', async (req, res) => {
    try {
        const { adminKey } = req.body;
        if (adminKey !== process.env.ADMIN_SYNC_KEY) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        console.log('Starting NYT sync via admin endpoint...');
        await syncNYTBestSellers();
        console.log('NYT sync completed successfully');
        
        res.json({ 
            success: true, 
            message: 'NYT bestsellers sync completed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('NYT sync failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sync failed', 
            error: error.message 
        });
    }
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    ///^(?!\/api).*/
    // Serve the React app for all non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => res.send('Server is ready'));
}


//Error Handler
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`Server started on port ${port}`));