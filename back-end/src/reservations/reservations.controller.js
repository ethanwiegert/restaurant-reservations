/**
 * List handler for reservation resources
 */
const service=require("./reservations.service.js")
const asyncErrorBoundary=require("../errors/asyncErrorBoundary")
const hasProperties=require("../errors/hasProperties.js")

const ValidProperties=[
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

async function reservationForDateExists(req, res, next){
  const date=req.query.date
  const data=await service.list(date)
  if(!data.length){
    return next({
      status:400,
      message: `No reservations for the data ${date} found`
    })
  }
  next()
}

const hasRequiredFields=hasProperties("first_name",
"last_name",
"mobile_number",
"reservation_date",
"reservation_time",
"people")



async function list(req, res) {
  const date=req.query.date
 res.send({data: await service.list(date)})
}

async function create(req, res, next){
  const reservation=req.body.data
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({data: reservation})
}

module.exports = {
  list: [reservationForDateExists, asyncErrorBoundary(list)],
  create: [hasRequiredFields, asyncErrorBoundary(create)],
};
