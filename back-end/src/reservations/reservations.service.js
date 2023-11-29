const knex=require("../db/connection")

function list(date){
    return knex("reservations")
    .select("*")
    .where({reservation_date:date})
    .orderBy("reservation_time")
}

function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords)=>createdRecords[0])
}

function read(reservationId){
    return knex("reservations")
    .select("*")
    .where({reservation_id:reservationId})
    .first()
}

function update(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id:updatedReservation.reservation_id})
    .update(updatedReservation)
}

module.exports={
    list,
    create,
    read,
    update,
}