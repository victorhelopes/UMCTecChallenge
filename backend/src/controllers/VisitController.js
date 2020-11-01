const { response } = require('express');
const connection = require('../database/connection');

module.exports ={
    async get(request, response){
        const result = await connection('visit').select('*')

        return response.json( result )
    },

    async create(request, res){
        const {patientId} = request.body;

        const result = await connection('patient').where('id', patientId).select('*')

        if( result == 0 ){
            return response.json( { message : "Patient not found"} )
        }

        await connection('visit').insert({
            patientId
        })

        return res.json( { message : " Visit registered" } )
    }
}