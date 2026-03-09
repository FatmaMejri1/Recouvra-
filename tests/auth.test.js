const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/user");

let mongoServer;

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

describe("Auth API", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Fatma",
        email: "fatma@example.com",
        password: "secure123",
        role: "admin"
      })
      .expect(201);

    expect(res.body).toHaveProperty("message", "User created successfully");
  });

  it("should fail registration with missing fields", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com" })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });

  it("should fail registration with invalid email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Fatma", email: "invalid", password: "123456" })
      .expect(400);

    expect(res.body).toHaveProperty("message", "Invalid email format");
  });

  it("should fail registration if email already exists", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Fatma", email: "fatma@example.com", password: "secure123" });

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Fatma", email: "fatma@example.com", password: "secure123" })
      .expect(400);

    expect(res.body).toHaveProperty("message", "Email already in use");
  });

  it("should login successfully and return token", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Fatma", email: "fatma@example.com", password: "secure123" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "fatma@example.com", password: "secure123" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "fatma@example.com");
  });

  it("should fail login with wrong password", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Fatma", email: "fatma@example.com", password: "secure123" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "fatma@example.com", password: "wrongpass" })
      .expect(401);

    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should fail login with non-existent email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "noone@example.com", password: "123456" })
      .expect(401);

    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should fail login with missing fields", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com" })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });
});