import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema({
    idUser:{
        type:Number, 
        unique:true,
        required: true,
    }
}, {timestamps: true})

export const RdIdUserMUSIC = mongoose.model('RdIdUserMUSIC', postSchema);
