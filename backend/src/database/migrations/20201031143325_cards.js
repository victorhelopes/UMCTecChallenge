
exports.up = function(knex) {
    return knex.schema.createTable('card', function(table){
        table.increments("id").primary();
        table.date('checkIn').notNullable();
        table.integer('totalAmount').notNullable();
        table.integer('numberOfPendencies').notNullable();
        table.integer('numberOfOpenPendencies').notNullable();
        table.integer('numberOfDocuments').notNullable();
        table.integer('numberOfNotReceivedDocuments').notNullable();
        table.integer('numberOfChecklistItem').notNullable();
        table.integer('numberOfDoneChecklistItem').notNullable();

        table.integer('visitId');
        table.foreign('visitId').references('id').inTable('visit');

        table.integer('billId');
        table.foreign('billId').references('id').inTable('bill')

        table.integer('patientId')
        table.foreign('patientId').references('id').inTable('patient');

        table.integer('healthInsuranceId')
        table.foreign('healthInsuranceId').references('id').inTable('healthInsurance')

    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('card');
};
