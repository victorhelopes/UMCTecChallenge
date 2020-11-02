
exports.up = function(knex) {
    return knex.schema.createTable('bill',function(table){
        table.increments('id');
        table.enu('type',['HOSPITALAR', 'AMBULATORIAL']).notNullable();
        table.integer('total').notNullable()

        table.integer('patientId').notNullable();
        table.foreign('patientId').references('id').inTable('patient');

        table.integer('activityId').notNullable();
        table.foreign('activityId').references('id').inTable('activity');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('bill');
};
