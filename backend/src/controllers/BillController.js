const connection = require('../database/connection');

module.exports ={
    async create(request, response){
        const { type, total, patientId} = request.body;

        const result = await connection('patient').where('id', patientId ).select('*')

        if( result == 0 ){
            return response.json( { message : " Pacient was not found" } )
        }

        await connection('bill').insert({
            type, 
            total, 
            patientId
        })

        return response.json( { message : "Bill registred"} )
    },

    async get(request, response){
        const bills = await connection('bill').select('*')

        return response.json(  bills )
    }
}