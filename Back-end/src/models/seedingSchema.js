
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const seedingJobSchema = new Schema({
    top_left: {
        type: Array,
        required: true,
    },
    bottom_right: {
        type: Array,
        required: true
    },
    density: {
        type: Number,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
},
{ timestamps: true });

const SeedingModel = model("seeding", seedingJobSchema);


export default SeedingModel;


