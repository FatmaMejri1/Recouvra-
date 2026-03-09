const Payment = require("../models/payment");
const Invoice = require("../models/invoice");


exports.createPayment = async (req, res) => {
  try {
    const { invoice: invoiceId, amount, date, method } = req.body;

    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    
    const payments = await Payment.find({ invoice: invoiceId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.amount - totalPaid;

    if (amount > remaining) {
      return res.status(400).json({ message: "Payment exceeds remaining invoice amount" });
    }

   
    const payment = await Payment.create({
      invoice: invoiceId,
      client: invoice.client,
      amount,
      date,
      method,
      createdBy: req.user.id
    });

  
    if (amount === remaining) {
      invoice.status = "paid";
      await invoice.save();
    }

    res.status(201).json(payment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPayments = async (req, res) => {
  try {
    const { invoiceId, clientId } = req.query;
    const filter = {};
    if (invoiceId) filter.invoice = invoiceId;
    if (clientId) filter.client = clientId;

    const payments = await Payment.find(filter)
      .populate("invoice", "amount dueDate status")
      .populate("client", "name email")
      .populate("createdBy", "name email");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("invoice", "amount dueDate status")
      .populate("client", "name email")
      .populate("createdBy", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};