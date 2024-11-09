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

### Navigation Diagram (Screen Mockups)
![Mockup1 Diagram](https://github.com/user-attachments/assets/a1d22e29-17eb-4016-a392-23b6daaebd65)
- [Mockup1](https://marvelapp.com/whiteboard/nPB1tfnLTApB8c8Luxut)

### Data Storage
- **Client-Side Storage:** Logged-in user information and shopping cart data are stored on the client side using a local server. This allows quick access to user data and cart status during the shopping session.
- **Server-Side Storage:** In addition to client-side data, the following information is stored on the server:
    - User account details (id, name, email, address, phone, password)
    - Admin account details (id, name, email, phone, password)
    - Product information (name, photo, description, price, stock, quantity sold)
- React will be used to implement the server-side operations, which allows smooth data handling and state management for a seamless user experience.

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
- You can signup and edit users' profiles, and login as an admin to see the updated data stored locally.
- The user's main page initially shows no products. Once logged in as an admin you can register a new product, and this will update the local storage, showing the product in the main page (there is an initial limit of 4 products shown).

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
- All tests were successful, confirming that the application provides an easy and reliable experience for users.

---

## Build Procedures
1. **Prerequisites:**
   - Install Node.js and npm.
   - Install a code editor (e.g., VSCode).

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
