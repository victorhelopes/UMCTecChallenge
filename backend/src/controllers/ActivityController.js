const connection = require('../database/connection');

module.exports = {
    async get(req, res){
        const result = await connection('activity').select('*');

        return res.json( result )
    },

    async create(req,res){
        const { activityTitle, activitySubtitle, sla } = req.body;

       const  activity = await connection('activity').insert({
            activityTitle,
            activitySubtitle,
            sla,  
        })

        return res.json( activity );
    }
}