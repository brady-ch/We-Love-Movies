const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./theaters.service");

const list = async (req, res, next) => {
  const all = await service.list();
  res.json({ data: all });
};

module.exports = {
  list: [asyncErrorBoundary(list)],
};
