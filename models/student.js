import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

const StudentSchema = new Schema({
    classes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Class'
        }
    ],

    transactions: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Transaction'
        }
    ],

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },

    last4Digits: {
        type: String,
        required: true
    },

    uniqueId: {
        type: String,
        required: true
    },

    phoneNum: {
        type: String,
    },

    email: {
        type: String,
    },

    address: {
        type: String,
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

export const Student = models.Student || model('Student', StudentSchema)
