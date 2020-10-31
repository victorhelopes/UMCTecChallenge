
exports.up = function(knex) {
    return knex.schema.createTable('bill',function(table){
        table.increments('id');
        table.enu('column',['HOSPITALAR', 'AMBULATORIAL']).notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('bill');
};
