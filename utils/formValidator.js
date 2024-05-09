class FormValidator {
    validateEmail(email) {
        const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        return regex.test(email);
    }

    validatePassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{1,16}$/;
        return regex.test(password);
    }
    
    validateUsername(username) {
        const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{1,16})$/;
        return regex.test(username);
    }

    validatePassword(password) {
        const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_])([a-zA-Z0-9\W_]{1,20})$/;
        return regex.test(password);
    }
}

export default FormValidator;