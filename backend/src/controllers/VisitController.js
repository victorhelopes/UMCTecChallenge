const connection = require('../database/connection');

module.exports ={
    async create(req, res){
        await connection('visit').insert()

        return res.json( { message : " Bill registered" } )
    }
}