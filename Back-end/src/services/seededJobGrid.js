import express from 'express';
import seededModel from '../models/seededJobsSchema.js';
import createError from "http-errors";

const seededRouter = express.Router();


seededRouter.post("/", async (req, res, next) => {
    try {
        const newSeeding = new seededModel(req.body);
        const { _id } = await newSeeding.save();
        res.status(201).send({ _id });
    } catch (error) {
        if (error.name === "ValidationError") {
            next(createError(400, error));
        } else {
            console.log(error);
            next(createError(500, "An error occurred while creating new post"));
        }
    }
});

seededRouter.get('/', async (req, res, next) => {
    try {
        const response = await seededModel.find();
        res.status(201).send(response);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

seededRouter.get('/:id', async(req, res, next) => {
    try {
        const seeding = await seededModel.findById(req.params.id);
        res.status(200).json(seeding);

    } catch (error) {
        res.status(500).json(error)
    }
})

seededRouter.put('/:id', async (req, res, next) => {
    try {
        const updatedSeeding = await seededModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true
            }
        )
        res.status(200).json(updatedSeeding);

    } catch (error) {
        res.status(500).json(error);
    }
});

seededRouter.delete('/:id', async (req, res, next) => {
    try {
        const deletedSeeding = await seededModel.findByIdAndDelete(req.params.id);
        if (deletedSeeding) {
            res.status(204).send();
        } else {
            next(createError(404, `Seeding with _id ${req.params.id} not found!`));
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});



export default seededRouter;