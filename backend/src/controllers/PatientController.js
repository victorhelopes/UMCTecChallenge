
const connection = require('../database/connection');

module.exports = {
    async get(request,response){
        patients = await connection('patient').select('*');

        return response.json( patients )
    },

    async create(request, response){
        const { name, healthInsurance } = request.body

        const verifyhealthInsurance = await connection('healthInsurance').where('id', healthInsurance).select();

        if(verifyhealthInsurance == 0){
            return response.json( {message: "This Health Insurance does not exist, verify the correct id"} )
        }

        patient = await connection('patient').insert({
            name,
            healthInsurance
        })
        
        return response.json( patient );
    },

    async delete(request, response){
        const { id } = request.params;

        const result = await connection('patient').where('id',id).delete();

        if ( result == 0 ){
            return response.json( { message : "Pacient not found"} )
        }

        return response.json( { message : "Paciente deletado" } )
    }
}