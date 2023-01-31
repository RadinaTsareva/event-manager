const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const lowerCaseLetters = /[a-z]/g;
const upperCaseLetters = /[A-Z]/g;
const numbers = /[0-9]/g;

const validateEmail = (email) => {
    return email.toString()
        .toLowerCase()
        .match(emailRegex) || email.toString() === "";
};

const validatePassword = (password) => {
    if (password.toString() === "") {
        return true
    }
    if (!password.toString().match(lowerCaseLetters)) {
        return false
    }
    if (!password.toString().match(upperCaseLetters)) {
        return false
    }
    if (!password.toString().match(numbers)) {
        return false
    }
    if (password.toString().length < 8) {
        return false
    }

    return true
}

const validateText = (text, length) => {
    return text.toString().length > length
}

const validateDate = (date) => {
    const today = new Date()
    return !!date && new Date(date).getTime() > today.getTime()
}

const validatePhoneNumber = (phoneNumber) => {
    let length = 10
    if (phoneNumber[0] === '+') {
        length = 13
    }
    return phoneNumber.toString().length === length
}

const validateConfirmPassword = (password, confirmPassword) => {
    return password.toString() === confirmPassword.toString()
}

const validateOptions = (value) => {
    return !!value
}

export {
    validateOptions,
    validateEmail,
    validatePassword,
    validateText,
    validateDate,
    validatePhoneNumber,
    validateConfirmPassword
}