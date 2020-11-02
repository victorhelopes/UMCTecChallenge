const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate')

const ActivityController = require('./controllers/ActivityController');
const BillController = require('./controllers/BillController');
const CardController = require('./controllers/CardController');
const HealthInsuranceController = require('./controllers/HealthInsuranceController');
const PatientController = require('./controllers/PatientController');
const VisitController = require('./controllers/VisitController');

const routes = express.Router();

//Activity
routes.get('/GetActivity',ActivityController.get);
routes.post('/CreateActivity',celebrate({
    [Segments.BODY]: Joi.object().keys({
        activityTitle:Joi.string().required(),
        activitySubtitle:Joi.string().required(),
        sla: Joi.number().required(), 
    })
}),ActivityController.create);

//Card
routes.get('/GetCard',CardController.get);
routes.post('/CreateCard',celebrate({
    [Segments.BODY]: Joi.object().keys({
        checkIn: Joi.date().required(),
        numberOfPendencies: Joi.number().required(),
        numberOfOpenPendencies:Joi.number().required(),
        numberOfNotReceivedDocuments:Joi.number().required(),
        numberOfDocuments:Joi.number().required(),
        numberOfChecklistItem:Joi.number().required(),
        numberOfDoneChecklistItem:Joi.number().required(),
        visitId:Joi.number().required(),
        patientId:Joi.number().required(),
        healthInsuranceId:Joi.number().required(),
        activityId:Joi.number().required(),
        billId:Joi.number().required()
    })})
,CardController.create);
routes.delete('/DeleteCard/:id',CardController.delete);

//HealthInsurance
routes.post('/CreateHealthInsurance',HealthInsuranceController.create);
routes.get('/GetHealthInsurance',celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required()
    })
})
,HealthInsuranceController.get);

//Patient
routes.get('/Patients',PatientController.get);
routes.post('/CreatePatient',celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        healthInsurance: Joi.number().required()
    })
}),PatientController.create);
routes.delete('/DeletePatient/:id',PatientController.delete);

//Bill
routes.post('/CreateBill',celebrate({
    [Segments.BODY]: Joi.object().keys({
        type: Joi.string().required(),
        total: Joi.number().required(),
        patientId: Joi.number().required(),
        activityId:Joi.number().required(),
    })
}),BillController.create);
routes.get('/GetBill',BillController.get);

//Visit
routes.post('/CreateVisit',celebrate({
    [Segments.BODY]: Joi.object().keys({
        type: Joi.string().required(),
    })
}),VisitController.create);
routes.get('/GetVisit',VisitController.get);

module.exports = routes; 