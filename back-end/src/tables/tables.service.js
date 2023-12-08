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

async function destroy(table_id){
    const trx = await knex.transaction();
    let updatedTable = {};
    return trx("tables")
        .where({table_id})
        .update({reservation_id:null}, "*")
        .then((results)=>(updatedTable = results[0]))
        .then(trx.commit)
        .then(()=>updatedTable)
        .catch(trx.rollback)
}





module.exports={
    list,
    read,
    create,
    update,
    destroy
}