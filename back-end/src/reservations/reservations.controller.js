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

function checkPeople(req, res, next){
const people=req.body.data.people
let value=typeof people
if(value==="number"){
next()
}
else{
  return next({
    status:400,
    message: `people must be a number`
  })
}
}

function checkTimeAndDate(req, res, next){
  const date=req.body.data.reservation_date

  if(!Date.parse(date)){
    return next({
      status:400,
      message: `reservation_date is in incorrect format`
    })
  }
  const [hour, minute] = req.body.data.reservation_time.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return next({ status: 400, message: 'reservation_time is not a valid time' });
  }
  if (hour < 1 || hour > 23) {
    return next({ status: 400, message: 'reservation_time is not a valid time' });
  }
  if (minute < 0 || minute > 59) {
    return next({ status: 400, message: 'reservation_time is not a valid time' });
  }
  if(minute >= 30 && hour >= 21){
    return next({ status: 400, message: 'reservation_time is not a valid time, too close to closing' });
  }
  if(minute <= 30 && hour <= 10){
    return next({ status: 400, message: 'reservation_time is not a valid time, not opened' });
  }
  next()
}

function checkFutureDate(req, res, next){
  const date=req.body.data.reservation_date
  let today=Date.now()
  if(today>Date.parse(date)){
    return next({ status: 400, message: 'reservation_date cannot be a future date' });
  }
  next()
}

function checkNotTuesday(req, res, next){
  const date=req.body.data.reservation_date
  const day = new Date(date).getUTCDay()
  if(day===2){ return next({
    status:400,
    message: `reservation_date invalid for Tuesday, restaurant is closed`,
  })}
  next()
}

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

async function read(req, res, next) {
  const {reservationId}=req.params
  const data=await service.read(reservationId)
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(reservationForDateExists), asyncErrorBoundary(list)],
  create: [hasRequiredFields, checkFutureDate, checkNotTuesday, checkPeople, checkTimeAndDate, asyncErrorBoundary(create)],
  read:[asyncErrorBoundary(read)]
};
