const {employee} = require('../../config/env')
const users = [
        {
            email: employee.EMPLOYEE_1,  
            password: employee.EMPLOYEE_1_PASS
        },
        {
            email: employee.EMPLOYEE_2,  
            password: employee.EMPLOYEE_2_PASS
        }
    ];
    module.exports = users;

