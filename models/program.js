import { Schema, model, models } from "mongoose"

const ProgramSchema = new Schema({
    programName: {
        type: String,
        required: true
    },

    programCode: {
        type: String,
        required: true
    },

    programLength: {
        type: Number,
        required: true
    },

    programCost: {
        type: Number,
        required: true
    },

    effectiveOn: {
        type: String,
    },

    expiresOn: {
        type: String,
    },

    isActive: {
        type: Boolean,
        default: true
    }
})

export const Program = models.Program || model('Program', ProgramSchema)
