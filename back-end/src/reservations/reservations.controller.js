/**
 * List handler for reservation resources
 */
const service=require("./reservations.service.js")
const asyncErrorBoundary=require("../errors/asyncErrorBoundary")
const hasProperties=require("../errors/hasProperties.js")
const { as } = require("../db/connection.js")

const ValidProperties=[
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const validStatus=[
  "booked",
  "seated",
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

async function reservationExists(req, res, next){
  const {reservationId}=req.params
  data=await service.read(reservationId)
  if(data){
    res.locals.reservation=data;
    return next()
  }
  return next({
    status:404,
    message: `No reservation with ID ${reservationId} found`
  })
}

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

function checkDefaultStatus(req, res, next){
  const {status}=req.body.data
  if(status==="seated"){
    return next({
      status:400,
      message: `status cannot be seated for new reservation`,
    })}
    else if(status==="finished"){ 
      return next({
      status:400,
      message: `status cannot be finished for new reservation`,
    })}
    return next()
  }

function checkValidStatus(req, res, next){
  const {status}=res.locals.reservation
  if(status==="seated"){
    return next()
  }
    else if(status==="seated"){ 
      return next()
    }
    return next({
      status:400,
      message: `status cannot be unknown`,
    })
  }

function checkNotFinished(req, res, next){
  const {status}=res.locals.reservation
  if(status==="finished"){
    return next({
      status:400,
      message: `finished reservations cannot change status`,
    })
  }
  return next()
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

function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json( {data} );
}

async function update(req, res, next){
  const updatedReservation={...res.locals.reservation, ...req.body.data}
  const data=await service.update(updatedReservation)
  res.status(200).json({data})
}

module.exports = {
  list: [asyncErrorBoundary(reservationForDateExists), asyncErrorBoundary(list)],
  create: [hasRequiredFields, checkFutureDate, checkNotTuesday, checkPeople, checkTimeAndDate, checkDefaultStatus, asyncErrorBoundary(create)],
  read:[ asyncErrorBoundary(reservationExists), read],
  update:[asyncErrorBoundary(reservationExists), checkNotFinished, checkValidStatus, asyncErrorBoundary(update)],
};
