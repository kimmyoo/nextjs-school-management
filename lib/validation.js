// import { ObjectId } from 'mongodb';
// const ObjectId = require('mongoose').Types.ObjectId;

// form data validation before submission
const isProgramFormValid = (programData, setFormErrors) => {
    let errors = {};
    // program.programName and programCode
    if (!programData.name.trim()) {
        errors.name = '(required)'
    }
    if (!programData.code.trim()) {
        errors.code = '(required)'
    }
    // program.length and cost
    if (!programData.length) {
        errors.length = '(required)'
    } else if (isNaN(programData.length)) {
        errors.length = '(must be a number)'
    } else if (programData.length < 1) {
        errors.length = '(must be greater than 0)'
    }
    if (!programData.cost) {
        errors.cost = '(required)'
    } else if (isNaN(programData.cost)) {
        errors.cost = '(must be a number)'
    } else if (programData.cost < 0) {
        errors.cost = '(must be greater than 0)'
    }

    if (!programData.effectiveOn.trim()) {
        errors.effectiveOn = "(required)"
    }

    if (!programData.expiresOn.trim()) {
        errors.expiresOn = "(required)"
    }

    setFormErrors(errors)
    // return true if there is no error, otherwise false
    return Object.keys(errors).length === 0
};

const isInstructorFormValid = (instructorData, setFormErrors) => {
    let errors = {}
    if (!instructorData.name.trim()) {
        errors.name = '(required)'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
}


const isLicenseFormValid = (licenseData, setFormErrors) => {
    let errors = {}
    if (!licenseData.licenseNum.trim()) {
        errors.licenseNum = '(required)'
    }
    if (!licenseData.programId) {
        errors.program = '(required)'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
}


const isClassFormValid = (classData, setFormErrors) => {
    let errors = {}
    if (!classData.license) {
        errors.license = "(required)"
    }

    if (!classData.classCode.trim()) {
        errors.classCode = "(required)"
    }

    if (!classData.begin) {
        errors.begin = "(required)"
    }

    if (!classData.end) {
        errors.end = "(required)"
    }

    if (!classData.schedule) {
        errors.schedule = "(required)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
}


const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const isStudentFormValid = (studentData, setFormErrors) => {
    let errors = {}
    const yr = new Date().getFullYear()

    if (!studentData.uniqueId.trim()) {
        errors.uniqueId = "(required)"
    }
    if (!studentData.firstName.trim()) {
        errors.firstName = "(required)"
    }
    if (!studentData.lastName.trim()) {
        errors.lastName = "(required)"
    }
    if (!studentData.gender.trim()) {
        errors.gender = "(required)"
    }
    if (!studentData.last4Digits) {
        errors.last4Digits = "(required)"
    }

    if (!studentData.dob.trim()) {
        errors.dob = "(required)"
    } else if (yr - Number(studentData.dob.slice(0, 4)) < 15) {
        errors.dob = "(must be over 16 years old)"
    }

    if (studentData.email && !validateEmail(studentData.email)) {
        errors.email = "(Invalid email)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0

}

const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, ''); // Remove non-numeric characters
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formatted;
}


// function to check valid objectId
function isValidObjectId(id) {
    const hexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
    return hexRegExp.test(id)
}


function isTransactionFormValid(transactionData, setFormErrors) {
    let errors = {}
    if (!transactionData.class) {
        errors.selectedClass = '(required)'
    }

    if (!transactionData.amount) {
        errors.amount = '(required)'
    } else if (isNaN(transactionData.amount)) {
        errors.amount = '(must be a number)'
    } else if (transactionData.amount <= 0) {
        errors.amount = '(must be greater than 0)'
    }
    setFormErrors(errors)

    return Object.keys(errors).length === 0
}


export {
    isValidObjectId,
    isProgramFormValid,
    isInstructorFormValid,
    isLicenseFormValid,
    isClassFormValid,
    isStudentFormValid,
    formatPhoneNumber,
    isTransactionFormValid,
}