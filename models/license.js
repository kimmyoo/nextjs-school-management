import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

const LicenseSchema = new Schema({
    licenseNum: {
        type: String,
        required: true
    },

    program: {
        type: mongoose.Types.ObjectId,
        ref: 'Program',
        required: true
    },

    instructor: {
        type: mongoose.Types.ObjectId,
        // type: Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    }
})

export const License = models.License || model('License', LicenseSchema)
