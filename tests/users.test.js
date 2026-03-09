const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // your Express app
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");

let mongoServer;
let adminToken;

// Helper to create JWT for admin
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "testsecret",
    { expiresIn: "1h" }
  );
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("User API", () => {
  beforeEach(async () => {
    // Create an admin user to use for authentication
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "secure123",
      role: "admin"
    });
    adminToken = generateToken(admin);
  });

  it("should create a user successfully", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Fatma",
        email: "fatma@example.com",
        password: "secure123",
        role: "agent"
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "Fatma");
    expect(res.body).not.toHaveProperty("password");
  });

  it("should fail to create a user with invalid email", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Fatma",
        email: "invalid-email",
        password: "secure123",
        role: "agent"
      })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });

  it("should get all users", async () => {
    await User.create({ name: "Fatma", email: "fatma@example.com", password: "secure123", role: "agent" });

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.length).toBe(2); // Admin + Fatma
    expect(res.body[1]).toHaveProperty("name", "Fatma");
  });

  it("should get user by ID", async () => {
    const user = await User.create({ name: "John", email: "john@example.com", password: "secure123", role: "agent" });

    const res = await request(app)
      .get(`/users/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("name", "John");
  });

  it("should update a user", async () => {
    const user = await User.create({ name: "John", email: "john@example.com", password: "secure123", role: "agent" });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "John Updated" })
      .expect(200);

    expect(res.body).toHaveProperty("name", "John Updated");
  });

  it("should delete a user", async () => {
    const user = await User.create({ name: "John", email: "john@example.com", password: "secure123", role: "agent" });

    await request(app)
      .delete(`/users/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const found = await User.findById(user._id);
    expect(found).toBeNull();
  });
});