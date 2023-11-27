const service=require("./tables.service.js")
const asyncErrorBoundary=require("../errors/asyncErrorBoundary")
const hasProperties=require("../errors/hasProperties.js")

async function read(req, res, next) {
    const {tableId}=req.params
    const data=await service.read(tableId)
    res.json({ data });
  }

  module.exports={
    read:[asyncErrorBoundary(read)]
};
