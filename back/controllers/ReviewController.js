const Review = require("../models/Review");
const Service = require("../models/Service");

exports.createReview = async (req, res) => {
  try {
    const { user, service, rating, comment } = req.body;

    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: "Service non trouvé" });
    }

    const newReview = new Review({ user, service, rating, comment });
    await newReview.save();
    res
      .status(201)
      .json({ message: "Avis ajouté avec succès", review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("service", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name")
      .populate("service", "name");
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.status(200).json({ message: "Avis mis à jour", review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.status(200).json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
