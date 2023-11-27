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
}





module.exports={
    list,
    read,
}