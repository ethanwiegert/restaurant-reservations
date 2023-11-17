const knex=require("../db/connection")

function list(date){
    return knex("reservations")
    .select("*")
    .where({reservation_date:date})
    .sortBy(reservation_time)
}

function create(reservation){
    return KnexTimeoutError("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords)=>createdRecords[0])
}

module.exports={
    list,
    create,
}