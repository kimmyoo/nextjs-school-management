// import { ObjectId } from 'mongodb';
const ObjectId = require('mongoose').Types.ObjectId;

// form data validation before submission
const isProgramFormValid = (programData, setFormErrors) => {
    let errors = {};
    // program.programName and programCode
    if (!programData.name.trim()) {
        errors.name = 'required'
    }
    if (!programData.code.trim()) {
        errors.code = 'required'
    }
    // program.length and cost
    if (!programData.length) {
        errors.length = "required"
    } else if (isNaN(programData.length)) {
        errors.length = 'must be a number'
    } else if (programData.length < 1) {
        errors.length = 'length must be greater than 0'
    }
    if (!programData.cost) {
        errors.cost = "required"
    } else if (isNaN(programData.cost)) {
        errors.cost = 'must be a number'
    } else if (programData.cost < 0) {
        errors.cost = 'must be greater than 0'
    }

    if (!programData.effectiveOn.trim()) {
        errors.effectiveOn = "required"
    }

    if (!programData.expiresOn.trim()) {
        errors.expiresOn = "required"
    }

    setFormErrors(errors)
    // return true if there is no error, otherwise false
    return Object.keys(errors).length === 0
};

const isInstructorFormValid = (instructorData, setFormErrors) => {
    let errors = {}

    if (!instructorData.name.trim()) {
        errors.name = 'required'
    }
    setFormErrors(errors)

    return Object.keys(errors).length === 0
}


const isLicenseFormValid = (licenseData, setFormErrors) => {
    let errors = {}

    if (!licenseData.licenseNum.trim()) {
        errors.licenseNum = 'required'
    }

    if (!licenseData.programId) {
        errors.program = 'required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
}

// function to check valid objectId
function isValidObjectId(id) {
    const hexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
    return hexRegExp.test(id)
}



export {
    isValidObjectId,
    isProgramFormValid,
    isInstructorFormValid,
    isLicenseFormValid,
}