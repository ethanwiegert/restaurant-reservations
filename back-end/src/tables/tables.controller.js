const service=require("./tables.service.js")
const reservationService=require("../reservations/reservations.service.js")
const asyncErrorBoundary=require("../errors/asyncErrorBoundary")
const hasProperties=require("../errors/hasProperties.js")

const hasRequiredFields=hasProperties("table_name",
"capacity")

const updateHasRequiredFields=hasProperties(
"reservation_id")

async function reservationIdExists(req, res, next){
    const reservationId=req.params.data.reservation_id
    const reservation=await reservationService.read(reservationId)
    if(!reservation.reservation_id){
        return next({
            status:404,
            message: `Reservation id ${reservationId} does not exist`
          })
    }
 next()
}

async function checkTableCapacity(req, res, next){
    const reservationId=req.params.data.reservation_id
    const reservation=await reservationService.read(reservationId)
    const tableCapacity=req.params.data.capacity
    if(reservation.people>tableCapacity){
        return next({
            status:404,
            message: `Insufficient capacity for reservation`
          })
    }
    next()
}

async function checkIfOccupied(req, res, next){
    const reservationId=req.data.reservation_id
    if(reservationId!==null){
        return next({
            status:404,
            message: `Table is currently occupied`
          })
    }
    next()
}

async function tableExists(req, res, next){
    const {tableId}=req.params
    const data=await service.read(tableId)
    if(!data.table_id){
      return next({
        status:404,
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
    next()
}

async function read(req, res, next) {
    const {tableId}=req.params
    const data=await service.read(tableId)
    res.json({ data });
  }

async function create(req, res, next){
    const table=req.body.data
    const { table_id } = await service.create(table);
    table.table_id = table_id;
    res.status(201).json({data: table})
}

async function list(req, res, next){
    const data=await service.list()
    res.json({ data });
}

async function update(req, res, next){
    const data=await service.update(req.body.data)
    res.json({data})
}

  module.exports={
    read:[asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    create:[hasRequiredFields, checkCapacity, checkTableName, asyncErrorBoundary(create)],
    list:[asyncErrorBoundary(list)],
    update:[updateHasRequiredFields, asyncErrorBoundary(reservationIdExists), asyncErrorBoundary(checkTableCapacity), asyncErrorBoundary(checkIfOccupied), asyncErrorBoundary(update)]
};
