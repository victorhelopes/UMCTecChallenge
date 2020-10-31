const express = require('express');

const ActivityController = require('./controllers/ActivityController');
const BillController = require('./controllers/BillController');
const CardController = require('./controllers/CardController');
const HealthInsuranceController = require('./controllers/HealthInsuranceController');
const PatientController = require('./controllers/PatientController');
const VisitController = require('./controllers/VisitController');

const routes = express.Router();

//Activity
routes.post('/',ActivityController.create);

//Card
routes.post('/',CardController.create);

//HealthInsurance
routes.post('/',HealthInsuranceController.create);

//Patient
routes.post('/',PatientController.create);

//Bill
routes.post('/',BillController.create);

//Visit
routes.post('/',VisitController.create);

module.exports = routes; 