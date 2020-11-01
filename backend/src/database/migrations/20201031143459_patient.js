
exports.up = function(knex) {
    return knex.schema.createTable('patient', function(table){
        table.increments('id');
        table.string('name').notNullable();

        table.integer('healthInsurance');
        table.foreign('healthInsurance').references('id').inTable('healthInsurance')
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('patient');
};
