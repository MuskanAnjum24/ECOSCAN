const Recycler = require('../models/Recycler');

const getAllRecyclers = async (req, res) => {
  try {
    res.json(await Recycler.find());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getNearbyRecyclers = async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city: new RegExp(city, 'i') } : {};
    res.json(await Recycler.find(query).limit(10));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getRecyclerById = async (req, res) => {
  try {
    const r = await Recycler.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Recycler not found' });
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addRecycler = async (req, res) => {
  try {
    res.status(201).json(await Recycler.create(req.body));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateRecycler = async (req, res) => {
  try {
    const r = await Recycler.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!r) return res.status(404).json({ message: 'Recycler not found' });
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteRecycler = async (req, res) => {
  try {
    await Recycler.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recycler deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllRecyclers, getNearbyRecyclers, getRecyclerById, addRecycler, updateRecycler, deleteRecycler };
