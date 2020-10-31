
exports.up = function(knex) {
    return knex.schema.createTable('visit', function(table){
        table.increments('visitId');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('visit');
};
