const knex=require("../db/connection")

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

function read(tableId){
    return knex("tables")
    .select("*")
    .where({table_id:tableId})
    .first()
}

function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords)=>createdRecords[0])
}

function update(updatedTable){
    return knex("tables")
    .select("*")
    .where({table_id:updatedTable.table_id})
    .update(updatedTable)
}





module.exports={
    list,
    read,
    create,
    update
}