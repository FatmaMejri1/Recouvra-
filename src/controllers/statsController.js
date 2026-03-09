const Invoice = require("../models/invoice");
const Payment = require("../models/payment");
const RecoveryAction = require("../models/recoveryAction");

// GET /stats
exports.getStats = async (req, res) => {
  try {
    // Optional query params
    const { clientId, startDate, endDate } = req.query;

    const invoiceFilter = {};
    const paymentFilter = {};
    const actionFilter = {};

    if (clientId) {
      invoiceFilter.client = clientId;
      paymentFilter.client = clientId;
    }

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      invoiceFilter.createdAt = dateFilter;
      paymentFilter.createdAt = dateFilter;
      actionFilter.date = dateFilter;
    }

    // Total unpaid invoices
    const unpaidInvoices = await Invoice.countDocuments({ ...invoiceFilter, status: "pending" });

    // Total payments received
    const payments = await Payment.find(paymentFilter);
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

    // Number of recovery actions per agent
    const actionsPerAgentAgg = await RecoveryAction.aggregate([
      { $match: actionFilter },
      { $group: { _id: "$performedBy", count: { $sum: 1 } } }
    ]);

    const actionsPerAgent = {};
    actionsPerAgentAgg.forEach(a => { actionsPerAgent[a._id] = a.count; });

    // Overdue invoices (dueDate < today and status pending)
    const overdueInvoices = await Invoice.countDocuments({
      ...invoiceFilter,
      status: "pending",
      dueDate: { $lt: new Date() }
    });

    res.json({
      unpaidInvoices,
      totalPayments,
      actionsPerAgent,
      overdueInvoices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};