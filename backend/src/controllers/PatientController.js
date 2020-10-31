const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const { name } = request.body
        patient = await connection('patient').insert({
            name
        })
        
        return response.json( patient );
    }
}