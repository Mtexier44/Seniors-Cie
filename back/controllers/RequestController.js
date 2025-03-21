const Request = require("../models/Request");
const Service = require("../models/Service");
const User = require("../models/User");

exports.createRequest = async (req, res) => {
  try {
    const { senior, service, assignedTo } = req.body;

    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: "Service non trouvé" });
    }

    const newRequest = new Request({ senior, service, assignedTo });
    await newRequest.save();
    res
      .status(201)
      .json({ message: "Demande créée avec succès", request: newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("senior", "name")
      .populate("service", "name")
      .populate("assignedTo", "name");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("senior", "name")
      .populate("service", "name")
      .populate("assignedTo", "name");

    if (!request) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }
    res
      .status(200)
      .json({ message: "Demande mise à jour", request: updatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }
    res.status(200).json({ message: "Demande supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
