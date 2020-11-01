
exports.up = function(knex) {
    return knex.schema.createTable('visit', function(table){
        table.increments('id');
        
        table.integer('patientId');
        table.foreign('patientId').references('id').inTable('patient')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('visit');
};
