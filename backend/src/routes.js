const express = require('express');

const ActivityController = require('./controllers/ActivityController');
const BillController = require('./controllers/BillController');
const CardController = require('./controllers/CardController');
const HealthInsuranceController = require('./controllers/HealthInsuranceController');
const PatientController = require('./controllers/PatientController');
const VisitController = require('./controllers/VisitController');

const routes = express.Router();

//Activity
routes.get('/GetActivity',ActivityController.get);
routes.post('/CreateActivity',ActivityController.create);

//Card
routes.get('/GetCard',CardController.get);
routes.post('/CreateCard',CardController.create);
routes.delete('/DeleteCard/:id',CardController.delete);

//HealthInsurance
routes.post('/CreateHealthInsurance',HealthInsuranceController.create);
routes.get('/GetHealthInsurance',HealthInsuranceController.get);

//Patient
routes.get('/Patients',PatientController.get);
routes.post('/CreatePatient',PatientController.create);
routes.delete('/DeletePatient/:id',PatientController.delete);

//Bill
routes.post('/CreateBill',BillController.create);
routes.get('/GetBill',BillController.get);

//Visit
routes.post('/CreateVisit',VisitController.create);
routes.get('/GetVisit',VisitController.get);

module.exports = routes; 