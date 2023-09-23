import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

const LicenseSchema = new Schema({
    licenseNum: {
        type: String,
        required: true
    },

    program: {
        type: mongoose.Types.ObjectId,
        ref: 'Program'
    },

    instructor: {
        type: mongoose.Types.ObjectId,
        ref: 'Instructor'
    }
})

export const License = models.License || model('License', LicenseSchema)
