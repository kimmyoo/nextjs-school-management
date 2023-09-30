import { Schema, model, models } from "mongoose"
import mongoose from "mongoose"

const TransactionSchema = new Schema({
    student: {
        type: mongoose.Types.ObjectId,
        ref: 'Student',
        required: true
    },

    class: {
        type: mongoose.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    // 'p' or 'r' classCode + uniqueId + timestamp
    tNumber: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    tNote: {
        type: String,
    },

    isRefund: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    }
)

export const Transaction = models.Transaction || model('Transaction', TransactionSchema)
