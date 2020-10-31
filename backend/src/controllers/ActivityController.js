const connection = require('../database/connection');

module.exports = {
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