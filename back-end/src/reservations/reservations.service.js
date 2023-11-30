const knex=require("../db/connection")

function list(date){
    return knex("reservations")
    .select("*")
    .where({reservation_date:date})
    .where({status:"seated"})
    .orWhere({status:"booked"})
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

function update(reservation_id, status) {
    return knex("reservations")
    .where({ reservation_id:reservation_id })
    .update({ status })
    .then(() => read(reservation_id))
};

module.exports={
    list,
    create,
    read,
    update,
}