const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // your Express app
const User = require("../src/models/user");
const Client = require("../src/models/Client");
const Invoice = require("../src/models/invoice");
const Payment = require("../src/models/payment");
const jwt = require("jsonwebtoken");

let mongoServer;
let adminToken;
let clientId;
let invoiceId;

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
  await Payment.deleteMany({});
});

describe("Payment API", () => {
  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "secure123",
      role: "admin"
    });
    adminToken = generateToken(admin);

    // Create client
    const client = await Client.create({
      name: "Client A",
      email: "clienta@example.com",
      phone: "123456789"
    });
    clientId = client._id;

    // Create invoice
    const invoice = await Invoice.create({
      client: clientId,
      amount: 1500,
      dueDate: "2026-04-01"
    });
    invoiceId = invoice._id;
  });

  it("should create a payment successfully", async () => {
    const res = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        invoice: invoiceId,
        client: clientId,
        amount: 1500,
        date: "2026-03-10",
        method: "cash"
      })
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.amount).toBe(1500);
    expect(res.body.method).toBe("cash");
  });

  it("should fail to create a payment with missing amount", async () => {
    const res = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        invoice: invoiceId,
        client: clientId,
        date: "2026-03-10"
      })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });

  it("should get all payments", async () => {
    await Payment.create({
      invoice: invoiceId,
      client: clientId,
      amount: 1500,
      date: "2026-03-10"
    });

    const res = await request(app)
      .get("/payments")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("amount", 1500);
  });

  it("should get payment by ID", async () => {
    const payment = await Payment.create({
      invoice: invoiceId,
      client: clientId,
      amount: 2000,
      date: "2026-03-11"
    });

    const res = await request(app)
      .get(`/payments/${payment._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("amount", 2000);
  });

  it("should update a payment", async () => {
    const payment = await Payment.create({
      invoice: invoiceId,
      client: clientId,
      amount: 2000,
      date: "2026-03-11"
    });

    const res = await request(app)
      .put(`/payments/${payment._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ method: "card" })
      .expect(200);

    expect(res.body).toHaveProperty("method", "card");
  });

  it("should delete a payment", async () => {
    const payment = await Payment.create({
      invoice: invoiceId,
      client: clientId,
      amount: 2000,
      date: "2026-03-11"
    });

    await request(app)
      .delete(`/payments/${payment._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const found = await Payment.findById(payment._id);
    expect(found).toBeNull();
  });
});