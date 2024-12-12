# Project Report

## Group 4
**Group Members:**
- Eduardo Garcia de Gáspari Valdejão, 11795676
- Didrick Chancel Egnina Ndombi, 14822368

---

## Requirements
The requirements for this project are based on the assignment but include additional needs specific to our store implementation:

- User Registration
- User Login
- Product Browsing
- Shopping Cart Functionality
- Order Processing
- Admin Management (Product and User Management)
- Responsive Design

Additional requirements based on our implementation:
- User profile management (edit profile details)
- Product search functionality
- User reviews and ratings for products

---

## Project Description
This project implements a functional e-commerce store that allows users to browse products, add them to a shopping cart, and complete purchases. The main functionalities include:

1. **User Registration and Login:** Users can create accounts and log in to access personalized features.
2. **Product Browsing:** Users can view and search for products by categories and keywords.
3. **Shopping Cart:** Users can add products to their cart, adjust quantities, and proceed to checkout.
4. **Order Management:** Users can view their order history and track orders.
5. **User Profile Management:** Users can edit their profile details, including name, email, address, phone number, and profile picture.
6. **Product Search Functionality:** A dynamic search bar allows users to search for products by keywords, which is updated in real-time as the user types.
7. **Favorites:** Users can add products to their favorite list for later viewing or purchase.

---

## Navigation Diagram (Screen Mockups)
![Mockup1 Diagram](https://github.com/user-attachments/assets/a1d22e29-17eb-4016-a392-23b6daaebd65)
- [Mockup1](https://marvelapp.com/whiteboard/nPB1tfnLTApB8c8Luxut)

---

## Data Storage
- **Client-Side Storage:**  
  Logged-in user information and shopping cart data are stored on the client side using `sessionStorage`. This ensures quick access to user data and cart status during the shopping session. User session data, such as `loggedInUser`, is now stored in `sessionStorage` to maintain the state of the session throughout the user's interaction with the site.
  
- **Server-Side Storage:**  
  On the server-side, MongoDB is used to store the following information:
  - User account details (id, name, email, address, phone, password).
  - Admin account details (id, name, email, phone, password).
  - Product information (name, photo, description, price, stock, quantity sold).

- **SessionStorage for Cart and Order Data:**  
  In addition to user information, shopping cart data is stored in `sessionStorage`, enabling quick access to the cart during the user's session. Similarly, when a user completes an order, the order details (including products purchased, total cost, etc.) are temporarily stored in `sessionStorage` until they are finalized and saved to the MongoDB database. This ensures a seamless checkout experience for the user.
  
- **Dynamic Search and Favorites:**  
  The product search functionality is dynamic, enabling users to search for products as they type, making the browsing experience more intuitive. Additionally, users can add products to their favorites list, allowing easy access to previously viewed or purchased products.

- **SessionStorage for User Data:**  
  After a user logs in, the `loggedInUser` object is stored in `sessionStorage`. This allows the profile page to be accessed directly with personalized user details, and the session persists even if the user navigates between pages (until they log out).

---

## Comments About the Code
- The main entry file is `landing_page.html`, which serves as the index page for the online store.
- The code is organized into multiple modules for user management, product management, and order processing. 
- Inline comments have been added to complex functions for clarity.
- To enter as the default admin, use the following credentials:
    ```bash
    email:     admin@example.com
    password:  admin
    ```
- To enter as one of the default users, use the following credentials:
    ```bash
    email: john@example.com  
    password: password123
    ```
- **Profile Page and SessionStorage:**  
  The user profile page now utilizes `sessionStorage` to store the logged-in user information. This ensures that the user's details are persistent during their session and are easily accessible without repeated server requests.
  
- **Dynamic Search Bar:**  
  The search bar dynamically updates product results as the user types, querying the MongoDB database in real-time. This feature enhances the user experience by making it easier to find products instantly.

- **Completed Purchase Pipeline:**  
  The purchase pipeline now includes a complete checkout process, from adding products to the cart, editing quantities, completing the order, and viewing order history. The implementation ensures that orders are processed and stored correctly, with users receiving confirmation and order details.

- **User Profile Management:**  
  The user profile management section allows users to edit their profile, including their name, email, phone number, address, and profile picture. After the user saves the changes, their data is updated in both `sessionStorage` and the MongoDB database, ensuring consistency across sessions.

- **Product Pages and Favorites:**  
  The product detail pages now include options for users to add products to their favorite list. This is implemented through MongoDB by storing a list of favorite product IDs in the user's profile, which is then used to render their favorites on the profile page.

---

## Test Plan
We will conduct the following tests to ensure functionality:
- **Unit Tests:** Each function will be tested individually to verify correctness.
- **Integration Tests:** Test interactions between modules (e.g., user login and product browsing).

---

## Test Results
**Manual Testing Summary:**
- We conducted manual testing across all pages to ensure they are functional, interactive, and work as intended. This includes:
  - Ensuring user navigation is intuitive and responsive.
  - Verifying data storage consistency for a reliable user experience.
  - Testing all interactive components, such as adding items to the cart, updating profile details, and processing orders.
  - **Admin Testing:** We verified that the default admin login credentials work, and the admin has the ability to manage products and users effectively.

**Tests on `sessionStorage`:**
- Verified that user login stores their data in `sessionStorage`, allowing persistent access across pages.
- Confirmed that the `sessionStorage` is cleared upon logout.
- Verified that cart and order information is stored in `sessionStorage` during the shopping session, and this data is available until the order is completed or the user logs out.

**Tests on MongoDB Integration:**
- Verified that data is correctly stored and retrieved from MongoDB for both users and products.
- Ensured that the product catalog is dynamic and reflects changes made by admins.

---

## Build Procedures

1. **Prerequisites:**  
     - Ensure **Node.js** and **npm** are properly installed and functional on your system.  
     - Install **MongoDB** and ensure it is running and connected to the application (either locally or through a cloud service like MongoDB Atlas).  
   
2. **Download the Repository Files:**  
     To get started, download the repository files to your local machine. You can do this by either cloning the repository using Git or downloading the ZIP file from GitHub:
     - Clone the repository using Git:  
       ```bash
       git clone https://github.com/yourusername/yourproject.git
       ```
     - Or download the ZIP file from GitHub, extract it, and navigate to the project folder in your terminal.

3. **Navigate to the Project Directory:**
    After downloading or cloning the repository, open a terminal and navigate to the project directory:
      ```bash
      cd yourproject
      ```

4. **Install Dependencies:**
    Once inside the project directory, install all the required dependencies using npm:
      ```bash
      npm install
      ```

5. **Test MongoDB Connection:**
    Make sure MongoDB is installed and running on your machine. If you're using a local setup, start the MongoDB server by running:
      ```bash
      mongod
      ```
    Alternatively, ensure that the application is connected to MongoDB Atlas or another cloud-based service if you prefer a hosted database.
  
6. **Start the Node.js Server:**
    After the dependencies are installed, you can start the Node.js server with the following command:
      ```bash
      npm start
      ```
    This will start the server and run the application locally (usually accessible at `http://localhost:5000`).

7. **Open the Project in a Browser:**
    After starting the server and ensuring MongoDB is connected, open the `landing_page.html` file in a browser to view and test the application. You can open it directly via the file explorer or navigate to the file from your terminal, for example:
      ```bash
      open landing_page.html
      ```
8. **Test the Application:**
    Once the page is loaded, perform the following tests to ensure the application is functioning as expected:
    
    - Verify that the dynamic search bar is working and updating results in real-time as you type.
    - Test user login and profile management, ensuring you can edit user details successfully.
    - Log in as the admin (using the default credentials) to test product and user management features.
    - Ensure the shopping cart, order processing, and product display functions work as expected.
    
9. **Admin Credentials for Testing:**
    To log in as the default admin, use the following credentials:
      ```bash
      email: admin@example.com  
      password: admin
      ```

10. **User Credentials for Testing:**
    To log in as one of the default users, use the following credentials:
      ```bash
      email: john@example.com  
      password: password123
      ```
