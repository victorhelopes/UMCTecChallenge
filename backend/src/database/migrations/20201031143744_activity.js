const { table } = require("../connection");

exports.up = function(knex) {
    return knex.schema.createTable('activity', function(table){
        table.increments('id');
        table.string('activityTitle').notNullable();
        table.string('activitySubtitle').notNullable();
        table.integer('sla').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('activity');
};
