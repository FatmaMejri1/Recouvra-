const RecoveryAction = require("../models/recoveryAction");
const Invoice = require("../models/invoice");


exports.createRecoveryAction = async (req, res) => {
  try {
    const { invoiceId, action, date } = req.body;

    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const recoveryAction = await RecoveryAction.create({
      invoiceId,
      performedBy: req.user.id,
      action,
      date
    });

    res.status(201).json(recoveryAction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getRecoveryActions = async (req, res) => {
  try {
    const { invoiceId } = req.query;
    const filter = {};
    if (invoiceId) filter.invoiceId = invoiceId;

    const actions = await RecoveryAction.find(filter)
      .populate("invoiceId", "amount dueDate status")
      .populate("performedBy", "name email");

    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getRecoveryActionById = async (req, res) => {
  try {
    const action = await RecoveryAction.findById(req.params.id)
      .populate("invoiceId", "amount dueDate status")
      .populate("performedBy", "name email");

    if (!action) {
      return res.status(404).json({ message: "Recovery action not found" });
    }

    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateRecoveryAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!action) return res.status(404).json({ message: "Recovery action not found" });
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteRecoveryAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findByIdAndDelete(req.params.id);
    if (!action) return res.status(404).json({ message: "Recovery action not found" });
    res.json({ message: "Recovery action deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};