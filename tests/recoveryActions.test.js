const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // your Express app
const User = require("../src/models/user");
const Client = require("../src/models/Client");
const Invoice = require("../src/models/invoice");
const Payment = require("../src/models/payment");
const RecoveryAction = require("../src/models/recoveryAction");
const jwt = require("jsonwebtoken");

let mongoServer;
let adminToken;
let invoiceId;
let userId;

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
  await Invoice.deleteMany({});
  await RecoveryAction.deleteMany({});
});

describe("RecoveryAction API", () => {
  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "secure123",
      role: "admin"
    });
    adminToken = generateToken(admin);
    userId = admin._id;

    // Create an invoice
    const invoice = await Invoice.create({
      client: userId, // just linking user as client for simplicity
      amount: 1000,
      dueDate: "2026-04-01"
    });
    invoiceId = invoice._id;
  });

  it("should create a recovery action successfully", async () => {
    const res = await request(app)
      .post("/recovery-actions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        invoiceId,
        performedBy: userId,
        action: "call client"
      })
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.action).toBe("call client");
  });

  it("should fail to create a recovery action with invalid action", async () => {
    const res = await request(app)
      .post("/recovery-actions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        invoiceId,
        performedBy: userId,
        action: "invalid action"
      })
      .expect(400);

    expect(res.body).toHaveProperty("message");
  });

  it("should get all recovery actions", async () => {
    await RecoveryAction.create({
      invoiceId,
      performedBy: userId,
      action: "send email"
    });

    const res = await request(app)
      .get("/recovery-actions")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("action", "send email");
  });

  it("should get recovery action by ID", async () => {
    const action = await RecoveryAction.create({
      invoiceId,
      performedBy: userId,
      action: "visit client"
    });

    const res = await request(app)
      .get(`/recovery-actions/${action._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.action).toBe("visit client");
  });

  it("should update a recovery action", async () => {
    const action = await RecoveryAction.create({
      invoiceId,
      performedBy: userId,
      action: "call client"
    });

    const res = await request(app)
      .put(`/recovery-actions/${action._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ action: "send email" })
      .expect(200);

    expect(res.body.action).toBe("send email");
  });

  it("should delete a recovery action", async () => {
    const action = await RecoveryAction.create({
      invoiceId,
      performedBy: userId,
      action: "call client"
    });

    await request(app)
      .delete(`/recovery-actions/${action._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const found = await RecoveryAction.findById(action._id);
    expect(found).toBeNull();
  });
});