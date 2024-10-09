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

### Navigation Diagram
![Mockup1 Diagram]([https://drive.google.com/file/d/1sj1L780ESq8qxIO5HB9NrLYDcKbaCl84/view?usp=sharing])

### Screen Mockups
- [Mockup1](https://marvelapp.com/whiteboard/nPB1tfnLTApB8c8Luxut)
- [Mockup2](link_to_mockup2)
- [Mockup3](link_to_mockup3)

### Data Storage
The following information will be saved on the server:
- User account details (id, name, email, address, phone, password)
- Admin account details (id, name, email, phone, password)
- Product information (name, photo, description, price, stock, quantity sold)

---

## Comments About the Code
- The code is organized into multiple pages, separated into modules for user management, product management, and order processing.
- Inline comments have been added to complex functions for clarity.
- To enter as the default admin Login with the following credentials:
    ```bash
    email:     admin@example.com
    password:  admin
    ```

---

## Test Plan
We will conduct the following tests to ensure functionality:
- **Unit Tests:** Each function will be tested individually to verify correctness.
- **Integration Tests:** Test interactions between modules (e.g., user login and product browsing).

**Testing Tools:** We plan to use [JUnit](https://junit.org/) for unit tests and [Postman](https://www.postman.com/) for testing the backend API.

---

## Test Results
*To be filled after conducting tests.*  

---

## Build Procedures
1. **Prerequisites:**
   - Install Node.js and npm.
   - Install a code editor (e.g., VSCode).
   
2. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
