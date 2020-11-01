const connection = require('../database/connection');

module.exports = {
    async get(request, response){
        const healthInsurances = await connection('healthInsurance').select("*");

        return response.json( healthInsurances )
    },

    async create(request,response){
        const { name } = request.body;

        const healthInsurance = await connection('healthInsurance').insert({
            name
        })

        return response.json( healthInsurance )
    }
}