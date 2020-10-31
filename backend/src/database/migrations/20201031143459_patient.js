
exports.up = function(knex) {
    return knex.schema.createTable('patient', function(table){
        table.integer('id');
        table.string('name').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('patient');
};
