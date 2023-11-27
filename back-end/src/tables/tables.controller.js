const service=require("./tables.service.js")
const asyncErrorBoundary=require("../errors/asyncErrorBoundary")
const hasProperties=require("../errors/hasProperties.js")

const hasRequiredFields=hasProperties("table_name",
"capacity")

async function tableExists(req, res, next){
    const {tableId}=req.params
    const data=await service.read(tableId)
    if(!data.length){
      return next({
        status:400,
        message: `No table with ID ${tableId} found`
      })
    }
    next()
  }

function checkCapacity(req, res, next){
    const capacity=req.body.data.capacity
    if(capacity<=0){return next({
      status:400,
      message: `capacity must be greater than 0`,
    })
    }
    if(typeof capacity !=="number"){return next({
        status:400,
        message: `capacity must be a number`,
      })
    }
    next()
}

function checkTableName(req, res, next){
    const name=req.body.data.table_name
    if(name.length<2){return next({
        status:400,
        message: `table_name must be at least 2 characters long`,
      })
    }
}

async function read(req, res, next) {
    const {tableId}=req.params
    const data=await service.read(tableId)
    res.json({ data });
  }

async function create(req, res, next){
    const table=req.body.data
    const { table_id } = await service.create(table);
    reservation.table_id = table_id;
    res.status(201).json({data: table})
}

  module.exports={
    read:[asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    create:[hasRequiredFields, checkCapacity, asyncErrorBoundary(create)]
};
