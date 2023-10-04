import mongoose from "mongoose";
import { Program } from "@/models/program";
import { Instructor } from "@/models/instructor";
import { License } from "@/models/license";
import { Class } from "@/models/class";
import { Student } from "@/models/student";
import { Transaction } from "@/models/transaction";

export default function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const uri = process.env.MONGODB_URI
        return mongoose.connect(uri)
    }
}
