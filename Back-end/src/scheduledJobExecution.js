import express from 'express';
import wateringModel from '../models/WateringsSchema.js';

const plannedExecutionRouter = express.Router();

function getActiveJobs(){
    const jobs = await wateringModel.find('{ watering_status: /^Active/ }');
    return jobs;
}


function executeJob(){
    var activeJobs = getActiveJobs();
    var systemdate = new Date(); 
    for (let i=0;i<activeJobs.length;i++){
        const createdAt = new Date(activeJobs[i].createdAt)
        const updatedAt = new Date(activeJobs[i].updatedAt)
        const starting_date = new Date(activeJobs[i].starting_date)
        const starting_time = activeJobs[i].starting_time
        const interval = activeJobs[i].interval
 
 };
 
 var intervalId= '';
 seedingRouter.get("/start", async (req, res, next) => {
    try {
        intervalId  = setInterval(executeJob(), 2000);
    } catch (error) {
        if (error.name === "ValidationError") {
            next(createError(400, error));
        } else {
            console.log(error);
            next(createError(500, "An error occurred while starting the execution"));
        }
    }
});


seedingRouter.get("/stop", async (req, res, next) => {
    try {
        intervalId  = clearInterval(intervalId);
    } catch (error) {
        if (error.name === "ValidationError") {
            next(createError(400, error));
        } else {
            console.log(error);
            next(createError(500, "An error occurred while stopping the execution"));
        }
    }
});


export default plannedExecutionRouter;





