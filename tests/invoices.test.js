const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // your Express app
const User = require("../src/models/user");
const Client = require("../src/models/Client");
const Invoice = require("../src/models/invoice");
const jwt = require("jsonwebtoken");

let mongoServer;
let adminToken;

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
  await Invoice.deleteMany({});
});

describe("Invoice API", () => {
  let clientId;

  beforeEach(async () => {
    // Create an admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "secure123",
      role: "admin"
    });
    adminToken = generateToken(admin);

    // Create a client to associate with invoices
    const client = await Client.create({
      name: "Test Client",
      email: "client@example.com",
      phone: "123456789"
    });
    clientId = client._id;
  });

  it("should create an invoice successfully", async () => {
    const res = await request(app)
      .post("/invoices")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        client: clientId,
        amount: 1500,
        dueDate: "2026-04-01"
      })
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("amount", 1500);
    expect(res.body).toHaveProperty("status", "pending");
  });

  it("should fail to create an invoice with missing amount", async () => {
    const res = await request(app)
      .post("/invoices")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        client: clientId,
        dueDate: "2026-04-01"
      })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });

  it("should get all invoices", async () => {
    await Invoice.create({ client: clientId, amount: 1500, dueDate: "2026-04-01" });

    const res = await request(app)
      .get("/invoices")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("amount", 1500);
  });

  it("should get invoice by ID", async () => {
    const invoice = await Invoice.create({ client: clientId, amount: 2000, dueDate: "2026-05-01" });

    const res = await request(app)
      .get(`/invoices/${invoice._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("amount", 2000);
  });

  it("should update an invoice", async () => {
    const invoice = await Invoice.create({ client: clientId, amount: 2000, dueDate: "2026-05-01" });

    const res = await request(app)
      .put(`/invoices/${invoice._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "paid" })
      .expect(200);

    expect(res.body).toHaveProperty("status", "paid");
  });

  it("should delete an invoice", async () => {
    const invoice = await Invoice.create({ client: clientId, amount: 2000, dueDate: "2026-05-01" });

    await request(app)
      .delete(`/invoices/${invoice._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const found = await Invoice.findById(invoice._id);
    expect(found).toBeNull();
  });
});