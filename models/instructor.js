import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

const InstructorSchema = new Schema({
    instructorName: {
        type: String,
        required: true
    },

    instructorPhoneNum: {
        type: String
    },

    instructorEmail: {
        type: String
    },

    licenses: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'License'
        }
    ],
})

export const Instructor = models.Instructor || model('Instructor', InstructorSchema)
