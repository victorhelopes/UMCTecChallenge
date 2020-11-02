const connection = require('../database/connection');

function filterItems(DataCard, activity, q, typeQ,filter){
    var result = []
    if(activity != null){
        DataCard = DataCard.filter(function(DataCard){
            return (DataCard.activityId) == activity
        })
    }
    
    if( typeQ != null && q != null){
        if(typeQ == 'name'){
            DataCard = DataCard.filter(function(DataCard){  
                return (DataCard.patientName) == q
            })
        }else{
            if(typeQ == 'visitId' ){
                DataCard = DataCard.filter(function(DataCard){
                    return (DataCard.visitId) == q
                })
            }else{
                if(typeQ == 'billId' ){
                    DataCard = DataCard.filter(function(DataCard){
                        return (DataCard.billId) == q
                    })
                }
            }
        }
    }

    if(filter != null || filter == 'PRIORITY'){
        if(filter == 'TO_RECEIVE'){
            DataCard = DataCard.filter(function(DataCard){
                return (DataCard.numberOfNotReceivedDocuments > 0)
            })
        }else{
            DataCard = DataCard.filter(function(DataCard){
                return (DataCard.numberOfNotReceivedDocuments == 0 && DataCard.numberOfOpenPendencies == 0 && DataCard.numberOfDoneChecklistItem == DataCard.numberOfChecklistItem)
            })
        }
    }

    return DataCard
}

function dayDifference(Data){
    const now = new Date(); // Data de hoje
    const past = new Date(Data); // Outra data no passado
    const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
    const day = Math.ceil(diff / (1000 * 60 * 60 * 24)) - 1; //
    return day
}

function setResult( DataCard ){
    
    const data = Result
    const day =  DataCard.checkIn 
    const days = dayDifference(day) 
    data.daysSinceCreated = days

    if( days < (DataCard.sla * 0.75) ){
        data.slaStatus = "OK"
            }else{
                if(days <= DataCard.sla * 0.75){
                    data.slaStatus = "WARNING"
                }else{
                    data.slaStatus = "DELAYED"
                }
            }
            
            data.patient = {
                patientId: (DataCard.patientId),
                name: (DataCard.patientName)
            }

            data.healthInsurance = {
                healthInsuranceId : (DataCard.healthInsuranceId),
                name: (DataCard.healthInsuranceName)
            }
            data.visitId = DataCard.visitId
            data.bill = {
                billId : (DataCard.billId),
                billType : (DataCard.type),
                totalAmount : (DataCard.total),
            }
            data.numberOfPendencies = DataCard.numberOfPendencies
            data.numberOfOpenPendencies = DataCard.numberOfOpenPendencies
            data.numberOfDocuments = DataCard.numberOfDocuments
            data.numberOfNotReceivedDocuments = DataCard.numberOfNotReceivedDocuments
            data.numberOfChecklistItem = DataCard.numberOfChecklistItem
            data.numberOfDoneChecklistItems = DataCard.numberOfDoneChecklistItems
        return data
}

const Result = {
    daysSinceCreated: String,
    slaStatus: String,
    patient:{
      patientId: Number,
      name: String
    },
    healthInsurance:{
      healthInsuranceId: Number,
      name: String
    },
    visitId: Number,
    bill:{
      billId:Number,
      billType: String,
      totalAmount:Number
    },
    numberOfPendencies:Number,
    numberOfOpenPendencies:Number,
    numberOfDocuments:Number,
    numberOfNotReceivedDocuments:Number,
    numberOfChecklistItem:Number,
    numberOfDoneChecklistItems:Number,
}

module.exports = {
    async get(request, res){  
        let page = request.query.page;
        let limit = request.query.limit;
        let activity = request.query.activityId;
        let q = request.query.q;
        let typeQ = request.query.typeQ;
        let filter = request.query.filter
        
        var DataCard = await connection("card").
                           innerJoin('activity', 'activity.id', 'card.activityId').
                           innerJoin('bill', 'bill.id', 'card.billId').
                           innerJoin('healthInsurance', 'healthInsurance.id',  'card.healthInsuranceId').
                           innerJoin('patient', 'patient.id', 'card.patientId').
                           limit(limit).
                           offset((page-1) *1).
                           select('*', 'healthInsurance.name as healthInsuranceName', 'patient.name as patientName')

        
        DataCard = filterItems(DataCard, activity, q, typeQ,filter)
        let result = []

        var totalCardsOk = 0
        var totalCardsWarning = 0
        var totalCardsDelayed = 0
        
        for (i = 0; i < (DataCard.length); i++){  
            let aux = {}
            aux = ((setResult(DataCard[i])))
            result.push(JSON.parse(JSON.stringify(aux)))    
            if(result[i].slaStatus == "OK"){
                totalCardsOk += 1
            }else{
                if(result[i].slaStatus == "WARNING"){
                    totalCardsWarning += 1
                }else{
                    totalCardsDelayed += 1
                }
            }
        }

        final = {result,totalCardsOk,totalCardsWarning,totalCardsDelayed}

        return res.json( result )
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