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
  'booked', 'seated', 'finished', 'cancelled']


async function reservationForDateExists(req, res, next){
  if(req.query.date){
  const date=req.query.date
  const data=await service.list(date)
  if(!data.length){
    return next({
      status:400,
      message: `No reservations for the data ${date} found`
    })
  }
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
  const data=await service.read(reservationId)
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
    return next({ status: 400, message: 'reservation_date must be a future date' });
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
  const {status}=req.body.data
  if(validStatus.includes(status)){
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
  let data;

  if (req.query.date) {
    data = await service.list(req.query.date);
  } else {
    data = await service.search(req.query.mobile_number);
  }

  res.json({ data });
}


async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
}

function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json( {data} );
}

async function updateStatus(req, res, next){
  const data=await service.updateStatus(res.locals.reservation.reservation_id, req.body.data.status)
  res.status(200).json({data})
}

async function updateReservation(req, res, next){
  const updatedReservation=req.body.data
  const { reservation_id } = await service.updateReservation(updatedReservation);
  updatedReservation.reservation_id = reservation_id;
  res.status(200).json({data: updatedReservation})

}

module.exports = {
  list: [asyncErrorBoundary(reservationForDateExists), asyncErrorBoundary(list)],
  create: [hasRequiredFields, checkFutureDate, checkNotTuesday, checkPeople, checkTimeAndDate, checkDefaultStatus, asyncErrorBoundary(create)],
  read:[ asyncErrorBoundary(reservationExists), read],
  updateStatus:[asyncErrorBoundary(reservationExists), checkNotFinished, checkValidStatus, asyncErrorBoundary(updateStatus)],
  updateReservation:[asyncErrorBoundary(reservationExists), hasRequiredFields, checkFutureDate, checkNotTuesday, checkPeople, checkTimeAndDate, checkDefaultStatus, asyncErrorBoundary(updateReservation)],
};
