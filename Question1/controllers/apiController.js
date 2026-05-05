let items = [];

const getItems = (req, res) => {
    res.json(items);
};

const addItem = (req, res) => {
    const { name } = req.body;
    const newItem = { id: items.length + 1, name };
    items.push(newItem);
    res.status(201).json(newItem);
};

module.exports = { getItems, addItem };