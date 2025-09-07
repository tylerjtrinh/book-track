# 📘 Book Track - Full-Stack Reading List Management Website
Book Track is Full Stack React web application that enables users to add books to their reading list. There is also a search feature where books can be searched directly as well as an explore section in the homepage with current popular books. 
I personally enjoy reading so this was a fun project to make.
**Link to Project:** https://www.book-tracks.com/
Book Track is Full Stack React web application. It uses React, Node.js and PostgreSQL for the database.

### **How it's made**
**Tech used:** React, Redux, Node.js, PostgreSQL
**API used:** New York Times Books API, Google Books API

**Backend Implementation**
*JSON Web Token authentication system*
The `authMiddleware.js` implements token verification. 
*Authentication endpoint (/api/users)*
- User registration with validation and conflict handling
- Passwords are not stored directly. `userController.js` manages password hashing via bcrypt.
- Secure login with JWT token generation and cookie management  
- Session management with secure logout and token invalidation
*Personal Reading Management*
Manages personal reading collections with full CRUD operations. Users can add books, delete books, status tracking and favorites management.  
*Book Management Endpoints (/api/books)*
- Status management (want-to-read, currently-reading, completed) for reading progress tracking
- Favorites system with toggle functionality
- User book data is stored in the database
*New York Times Data Synchronization*
The New York Times Weekly Best Seller list updates weekly every Wednesday 7 PM Eastern Time. 
Data is fetched weekly from the New York Times Bestseller List and is synced to a table in the database to limit the number of API calls to only once per week. 
The `nytSync.js` file implements zero-downtime synchronization with the NYT Books API. Data is fetched from the NYT API and is then transferred to the explore_books table which stores that data.
To prevent down time during the synchronization a staging table strategy is used. First a new explore_books_staging table is created. Data gets posted to the staging table first. 
After all books are posted to the staging table. The staging table becomes the new explore_books table. However, if an error occurred then the old table is used. 

**Discovery Endpoints (/api/explore)**
- NYT bestseller data grouped by categories
- Curated popular collections across multiple lists
There is a search bar feature which can be used to type in book titles and author names to search books. 
This feature implements the Google Books API which has a vast amount of book data.

**Frontend Implementation**
*Key Frontend Modules:*
- store.js: Central state management hub that coordinates all application data using Redux Toolkit
- apiSlice.js: Base configuration for API calls to database
- authSlice.js: Manages user login status and remembers if someone is logged in (so they don't need to log in again when they return)
- userBooksApiSlice.js: Handles all personal book collection operations (add, remove, update books)
- exploreApiSlice.js: Manages the discovery/explore section data
*Core Components:*
- User: LoginPage, RegisterPage, ProfilePage with form validation
- Content Discovery: HomePage with a BookListings component. Has all the current NYT bestsellers 
- Book Management: ReadListPage where all user books can be found and filtered by
- Search Bar: Typing in a book title leads to a SearchResultsPage that shows a list of books that was fetched using the Google Book API

**Challenges Faced**
*Zero-Downtime Data Synchronization*
*Problem*: I found that when the synchronization was happening the home page did not have any book data to explore through. Weekly NYT updates caused service interruptions when directly updating the table that stores NYT data. 
*Solution*: Implemented staging table strategy where new data is loaded into a temporary table first, then the temporary table later becomes the new permanent table. 
*Redux State Management & Cache Invalidation*
*Problem*: This was my first time using redux so I had issues setting redux up. I was confused on why book status changes (add/remove/favorite) weren't immediately reflected in the UI
*Solution*: Implemented cache invalidation with specific tags, ensuring that when a user adds a book, all related components update
