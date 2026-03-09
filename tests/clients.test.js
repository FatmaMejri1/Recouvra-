const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // your Express app
const User = require("../src/models/user");
const Client = require("../src/models/Client");
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
  await Client.deleteMany({});
});

describe("Client API", () => {
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

  it("should create a client successfully", async () => {
    const res = await request(app)
      .post("/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "ABC Corp",
        email: "contact@abc.com",
        phone: "123456789",
        address: "123 Main St",
        company: "ABC Company"
      })
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name", "ABC Corp");
    expect(res.body).toHaveProperty("email", "contact@abc.com");
  });

  it("should fail to create a client with missing phone", async () => {
    const res = await request(app)
      .post("/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "NoPhone Corp",
        email: "nophone@example.com"
      })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });

  it("should get all clients", async () => {
    await Client.create({ name: "ABC Corp", email: "contact@abc.com", phone: "123456789" });

    const res = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("name", "ABC Corp");
  });

  it("should get client by ID", async () => {
    const client = await Client.create({ name: "XYZ Ltd", email: "xyz@example.com", phone: "987654321" });

    const res = await request(app)
      .get(`/clients/${client._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("name", "XYZ Ltd");
  });

  it("should update a client", async () => {
    const client = await Client.create({ name: "XYZ Ltd", email: "xyz@example.com", phone: "987654321" });

    const res = await request(app)
      .put(`/clients/${client._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ phone: "111222333" })
      .expect(200);

    expect(res.body).toHaveProperty("phone", "111222333");
  });

  it("should delete a client", async () => {
    const client = await Client.create({ name: "XYZ Ltd", email: "xyz@example.com", phone: "987654321" });

    await request(app)
      .delete(`/clients/${client._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const found = await Client.findById(client._id);
    expect(found).toBeNull();
  });
});