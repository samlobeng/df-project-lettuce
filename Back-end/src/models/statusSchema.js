import mongoose from "mongoose";

const { Schema, model } = mongoose;

const botStatusSchema = new Schema({
    action: {
        type: String,
        required: true,
     },    
},
{ timestamps: true });

const botStatusModel = model("botStatus", botStatusSchema);


export default botStatusModel;
