const connection = require('../database/connection');


function dayDifference(Data){
    const now = new Date(); // Data de hoje
    const past = new Date(Data); // Outra data no passado
    const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
    const day = Math.ceil(diff / (1000 * 60 * 60 * 24)) - 1; //
    return day
}


module.exports ={
    async get(req, res){
        const DataCard = await connection('card').select("*")
        
        const result = [{}] 
        var totalCardsOk = 0
        var totalCardsWarning = 0
        var totalCardsDelayed = 0

        for (i = 0; i < DataCard.length; i++){
            const slaActivity = await connection('activity').select('sla').where('id',DataCard[i].activityId).first()
            const bills = await connection('bill').where('id',DataCard[i].billId).select('*').first()
            const healthInsuranceInfos = await connection('healthInsurance').where('id',DataCard[i].healthInsuranceId).select('*').first()
            const patientInfos = await connection('patient').where('id', DataCard[i].patientId).select('name').first()
            
            const day =  DataCard[i].checkIn 
            const days = dayDifference(day)  
            result[i].daysSinceCreated = days

            if( days < (slaActivity.sla * 0.75) ){
                result[i].slaStatus = "OK"
                totalCardsOk += 1
            }else{
                if(days <= slaActivity.sla * 0.75){
                    result[i].slaStatus = "WARNING"
                    totalCardsWarning += 1
                }else{
                    result[i].slaStatus = "DELAYED"
                    totalCardsDelayed += 1
                }
            }
            
            result[i].patient = {
                patientId: (DataCard[i].patientId),
                name: (patientInfos.name)
            }

            result[i].healthInsurance = {
                healthInsuranceId : (healthInsuranceInfos.id),
                name: (healthInsuranceInfos.name)
            }
            result[i].visitId = DataCard[i].visitId
            result[i].bill = {
                billId : (bills.id),
                billType : (bills.type),
                totalAmount : (bills.total),
            }
            result[i].numberOfPendencies = DataCard[i].numberOfPendencies
            result[i].numberOfOpenPendencies = DataCard[i].numberOfOpenPendencies
            result[i].numberOfDocuments = DataCard[i].numberOfDocuments
            result[i].numberOfNotReceivedDocuments = DataCard[i].numberOfNotReceivedDocuments
            result[i].numberOfChecklistItem = DataCard[i].numberOfChecklistItem
            result[i].numberOfDoneChecklistItem = DataCard[i].numberOfDoneChecklistItem
            
        }
        final = {result,totalCardsOk,totalCardsWarning,totalCardsDelayed }
        return res.json( final )
    },


    async create(req, res){
        const {
            numberOfPendencies, 
            numberOfOpenPendencies, 
            numberOfDocuments, 
            numberOfNotReceivedDocuments, 
            numberOfChecklistItem, 
            numberOfDoneChecklistItem, 
            
            visitId,
            billId,
            activityId,
            patientId,
        } = req.body

        const patientData = await connection('patient').where('id',patientId).select('healthInsurance').first();
        const visitVerify = await connection('visit').where('id',visitId).select('id').first();
        const billVerify = await connection('bill').where('id',billId).select('id').first();
        if( visitVerify == 0 || billVerify == 0 || patientData == 0 ){
            return res.json( { message : "Visit or Bill was not find" } )
        }

        const healthInsuranceId = patientData.healthInsurance;
        const checkin = new Date().toLocaleDateString()
        
        const Card = await connection('card').insert({
            checkin,
            numberOfPendencies, 
            numberOfOpenPendencies, 
            numberOfDocuments, 
            numberOfNotReceivedDocuments, 
            numberOfChecklistItem, 
            numberOfDoneChecklistItem, 
            
            visitId,
            billId,
            activityId,
            patientId,
            healthInsuranceId 
        })

        return res.json( Card )
    },

    async delete(request, response){
        const { id } = request.params;

        const result = await connection('card').where('id', id).delete();
        if (result == 0 ){
            return response.json( { message : "Not found" } )
        }

        return response.json( { message : "Deleted successfully"})
    }
}