# Recouvra+ – Debt Recovery Management API

Recouvra+ is a powerful and secure REST API designed to streamline the debt recovery process for organizations. Built with performance and security in mind, it provides a comprehensive suite of tools to manage users, clients, invoices, and recovery efforts.

---

##  Key Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (Admin, Manager, Agent).
- **Client Management**: Full CRUD operations for managing client profiles and contact information.
- **Invoice Tracking**: Manage invoices, track due dates, and monitor payment statuses (Pending/Paid).
- **Manual Payment Recording**: Easily log payments received against specific invoices.
- **Recovery Action Logs**: Record every interaction (calls, emails, visits) taken by agents to recover debts.
- **Performance Analytics**: Real-time statistics including unpaid totals, payment history, and agent performance.
- **Data Validation**: Robust request validation using Joi schemas.
- **API Documentation**: Interactive Swagger UI for easy API exploration and testing.

---

##  Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (JSON Web Tokens) & Bcrypt for password hashing
- **Validation**: Joi & Express-Validation
- **Testing**: Jest & Supertest
- **Documentation**: Swagger UI & Swagger-JSDoc

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- MongoDB (Running locally or an Atlas URI)
- npm or yarn

---

##  Running the Application

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once running, the server will be available at `http://localhost:3000`.

---

## 📖 API Documentation

The API includes built-in Swagger documentation. Once the server is running, you can access the interactive UI at:

**`http://localhost:3000/api-docs`**

This allows you to view all endpoints, request bodies, and test the API directly from your browser.

---

## 🧪 Testing

The project includes a comprehensive test suite using Jest and Supertest.

### Run all tests
```bash
npm test
```

---

## Project Structure

- `src/app.js`: Application entry point and middleware configuration.
- `src/config/`: Database and Swagger configurations.
- `src/controllers/`: Business logic for each resource.
- `src/models/`: Mongoose schemas and models.
- `src/routes/`: API endpoint definitions.
- `src/middlewares/`: Authentication, authorization, and validation middlewares.
- `src/validators/`: Joi validation schemas.
- `tests/`: Integrated test suites for all modules.

---

##  License

This project is licensed under the ISC License.
