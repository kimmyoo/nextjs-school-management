import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

const ClassSchema = new Schema({
    program: {
        type: mongoose.Types.ObjectId,
        ref: 'Program',
        required: true
    },

    license: {
        type: mongoose.Types.ObjectId,
        ref: 'License',
        required: true
    },

    students: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Student'
        }
    ],

    classCode: {
        type: String,
        required: true
    },

    schedule: {
        type: String,
        required: true
    },

    begin: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    intshpBegin: {
        type: Date,
    },

    intshpEnd: {
        type: Date,
    },

    sideNote: {
        type: String,
    },

    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

export const Class = models.Class || model('Class', ClassSchema)
