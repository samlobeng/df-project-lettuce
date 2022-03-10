import express from 'express';
import botStatusModel from '../models/statusSchema.js';
import createError from "http-errors";

const statusRouter = express.Router();


statusRouter.get('/', async (req, res, next) => {
    try {
        const response = await botStatusModel.find();
        res.status(201).send(response);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// seedingRouter.get('/:id', async(req, res, next) => {
//     try {
//         const seeding = await botStatusModel.findById(req.params.id);
//         res.status(200).json(seeding);

//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

export default statusRouter;
