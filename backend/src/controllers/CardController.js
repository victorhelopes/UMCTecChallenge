const connection = require('../database/connection');

module.exports ={
    async create(req, res){
        const {
            totalAmout, 
            numberOfPendencies, 
            numberOfOpenPendencies, 
            numberOfDocuments, 
            numberOfNotReceivedDocuments, 
            numberOfChecklistItem, 
            numberOfDoneChecklistItem, 
            
            visitId,
            billId,

            patientName, 
            healthInsuranceName,
        } = req.body

        const healthInsuranceId = await connection('healthInsurance').where('name',healthInsuranceName).select('id')
        const PatientId = await connection('patient').where('name',patientName).select('id');
        const visitVerify = await connection('patient').where('id',visitId).select('id').first();
        const billVerify = await connection('patient').where('name',patientName).select('id').first();

        if( visitVerify == null || billVerify == null){
            return res.json( { message : "Visit or Bill was not find" } )
        }
        const checkin = new Date().getTime(); 
        const Card = await connection('card').insert({
            checkin,
            totalAmout, 
            numberOfPendencies, 
            numberOfOpenPendencies, 
            numberOfDocuments, 
            numberOfNotReceivedDocuments, 
            numberOfChecklistItem, 
            numberOfDoneChecklistItem, 
            
            visitId,
            billId,

            healthInsuranceId,
            PatientId
        })

        return res.json( Card )

    }
}