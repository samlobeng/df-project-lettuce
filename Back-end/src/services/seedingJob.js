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

export default seedingRouter;