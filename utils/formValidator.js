class formValidator {
    validateEmail(email) {
        const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        return regex.test(email);
    }

    validatePassword(password) {
        return password.length >= 10;
    }
}

export default formValidator;