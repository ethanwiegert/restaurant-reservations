const service=require("./tables.service.js")
const reservationService=require("../reservations/reservations.service.js")
const asyncErrorBoundary=require("../errors/asyncErrorBoundary")
const hasProperties=require("../errors/hasProperties.js")

const hasRequiredFields=hasProperties("table_name",
"capacity")

const updateHasRequiredFields=hasProperties(
"reservation_id")

async function reservationIdExists(req, res, next){
    const { reservation_id } = req.body.data;
    const reservation=await reservationService.read(reservation_id)
    if(reservation){
        res.locals.reservation = reservation;
        return next();
    }
    return next({
        status:404,
        message: `Reservation id ${reservation_id} does not exist`
      })
}

async function checkTableCapacity(req, res, next){
    const { capacity } = res.locals.table;
    const { people } = res.locals.reservation;
    
    if(people>capacity){
        return next({
            status:400,
            message: `Insufficient capacity for reservation`
          })
    }
    else{
    return next()
    }
}

async function checkIfOccupied(req, res, next){
    const {reservation_id}=res.locals.table
    if(reservation_id){
        return next({
            status:400,
            message: `Table is currently occupied`
          })
    }
    return next()
}

async function tableExists(req, res, next){
    const {tableId} = req.params;
    const data=await service.read(tableId)
    if(data){
     res.locals.table=data;
     return next();
    }
    return next({
        status:404,
        message: `No table with ID ${tableId} found`
      })
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
    const updatedTable={...res.locals.table, ...req.body.data}
    const data=await service.update(updatedTable)
    res.status(200).json({data})
}

  module.exports={
    read:[asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    create:[hasRequiredFields, checkCapacity, checkTableName, asyncErrorBoundary(create)],
    list:[asyncErrorBoundary(list)],
    update:[updateHasRequiredFields, asyncErrorBoundary(reservationIdExists), asyncErrorBoundary(tableExists), asyncErrorBoundary(checkTableCapacity), asyncErrorBoundary(checkIfOccupied), asyncErrorBoundary(update)]
};
