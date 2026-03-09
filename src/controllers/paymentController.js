const Payment = require("../models/payment");
const Invoice = require("../models/invoice"); // make sure the path is correct

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { invoice: invoiceId, amount, date, method } = req.body;

    // Find the invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Calculate total paid so far
    const payments = await Payment.find({ invoice: invoiceId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.amount - totalPaid;

    // Prevent overpayment
    if (amount > remaining) {
      return res.status(400).json({ message: "Payment exceeds remaining invoice amount" });
    }

    // Create the payment
    const payment = await Payment.create({
      invoice: invoiceId,
      client: invoice.client,
      amount,
      date: date || new Date(),
      method,
      createdBy: req.user.id
    });

    // Update invoice status
    if (amount === remaining) {
      invoice.status = "paid"; // fully paid
      await invoice.save();
    } else if (invoice.status === "paid") {
      // If invoice was previously marked paid but now partial payment, revert to pending
      invoice.status = "pending";
      await invoice.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments, optionally filter by invoiceId or clientId
exports.getPayments = async (req, res) => {
  try {
    const { invoiceId, clientId } = req.query;
    const filter = {};
    if (invoiceId) filter.invoice = invoiceId;
    if (clientId) filter.client = clientId;

    const payments = await Payment.find(filter)
      .populate("invoice", "amount dueDate status")
      .populate("client", "name email phone")
      .populate("createdBy", "name email");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("invoice", "amount dueDate status")
      .populate("client", "name email phone")
      .populate("createdBy", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Recalculate invoice status after deletion
    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      const payments = await Payment.find({ invoice: invoice._id });
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      invoice.status = totalPaid >= invoice.amount ? "paid" : "pending";
      await invoice.save();
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};