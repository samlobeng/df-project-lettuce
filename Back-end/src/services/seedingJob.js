import express from 'express';
import SeedingModel from '../models/seedingSchema.js';
import createError from "http-errors";

const seedingRouter = express.Router();


seedingRouter.post("/", async (req, res, next) => {
    try {
        const newSeeding = new SeedingModel(req.body);
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

// seedingRouter.get('/', async (req, res, next) => {
//     try {
//         const response = await SeedingModel.find();
//         res.status(201).send(response);
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// });

seedingRouter.get('/:id', async(req, res, next) => {
    try {
        const seeding = await SeedingModel.findById(req.params.id);
        res.status(200).json(seeding);

    } catch (error) {
        res.status(500).json(error)
    }
})

seedingRouter.put('/:id', async (req, res, next) => {
        try {
            const updatedSeeding = await SeedingModel.findByIdAndUpdate(
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

seedingRouter.delete('/:id', async (req, res, next) => {
    try {
        const deletedSeeding = await SeedingModel.findByIdAndDelete(req.params.id);
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



export default seedingRouter;