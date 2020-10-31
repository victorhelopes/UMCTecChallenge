const connection = require('../database/connection');

module.exports = {
    async create(req,res){
        const { name } = req.body;

        const healthInsurance = await connection('healthInsurance').insert({
            name
        })

        return res.json( healthInsurance )
    }
}