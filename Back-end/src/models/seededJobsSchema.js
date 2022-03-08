
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const seededJobSchema = new Schema({
        plant_type: {
            type: String,
            required: true,
        },
       positions:{
            type: Array
        },
    id:{
            type: Schema.Types.ObjectId,
            ref: "seeding"
    }
    },
    { timestamps: true });

const seededModel = model("seededJobGrid", seededJobSchema);


export default seededModel;


