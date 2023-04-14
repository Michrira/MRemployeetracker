const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "imthebest",
        database: "employees_db"
    },
    console.log(`Connected to the employees_db database.`)
);
// Start the application
function startApp() {
    // Prompt user for action to perform
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit",
        ],
    
    })
        .then((answer) => {
            // Call the appropriate function based on user choice
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    console.log("Goodbye!");
                    process.exit();
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    startApp(); 
            } 
        });
}

// Function to view all departments
function viewAllDepartments() {
    db.query(`SELECT * FROM department`, function (err, departments) {
        if (err) throw err;
        console.table(departments);
        startApp();
    });
}

// Function to view all roles
function viewAllRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary
               FROM role
               LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, function (err, roles) {
        if (err) throw err;
        console.table(roles);
        startApp();
    });
}

// Function to view all employees
function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
               FROM employee
               LEFT JOIN role ON employee.role_id = role.id
               LEFT JOIN department ON role.department_id = department.id
               LEFT JOIN employee manager ON manager.id = employee.manager_id`;

    db.query(sql, function (err, employees) {
        if (err) throw err;
        console.table(employees);
        startApp();
    });
}

/* // Connect to database and start the application
db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database.");
    startApp();
});  */
/*function viewAllEmployees() {
    // Query the database for all employees
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, employees) {
        if (err) throw err;
        // Log the results to the console in a formatted table
        console.table(employees);
        // Prompt the user to choose what to do next
        promptUser();
    });
}
function addDepartment() {
    // Prompt the user to enter the name of the new department
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the new department?",
        })
        .then((answer) => {
            // Insert the new department into the database
            db.query(`INSERT INTO department (name) VALUES (?)`, answer.name, function (err, result) {
                if (err) throw err;
                console.log(`\n${answer.name} department has been added to the database.\n`);
                // Prompt the user to choose what to do next
                promptUser();
            });
        });
}
function addRole() {
    // Query the database for all departments
    db.query(`SELECT * FROM department`, function (err, departments) {
        if (err) throw err;
        // Prompt the user to enter the details of the new role
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the new role?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary of the new role?",
                    validate: (value) => {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return "Please enter a valid number.";
                    },
                },
                {
                    name: "department",
                    type: "list",
                    message: "Which department does the new role belong to?",
                    choices: departments.map((department) => department.name),
                },
            ])
            .then((answer) => {
                // Find the id of the department the new role belongs to
                const department = departments.find((department) => department.name === answer.department);
                // Insert the new role into the database
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.title, answer.salary, department.id], function (err, result) {
                    if (err) throw err;
                    console.log(`\n${answer.title} role has been added to the database.\n`);
                    // Prompt the user to choose what to do next
                    promptUser();
                });
            });
    });
}
// Function to add a role
function addRole() {
    // Query the database for all departments
    db.query(`SELECT * FROM department`, function (err, departments) {
        if (err) throw err;
        // Prompt the user to enter the new role details
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the new role?",
                },
                {
                    name: "salary",
                    type: "number",
                    message: "What is the salary of the new role?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "Which department does the new role belong to?",
                    choices: departments.map((department) => department.name),
                },
            ])
            .then((answer) => {
                // Get the department ID
                const department = departments.find(
                    (dept) => dept.name === answer.department
                );
                // Insert the new role into the database
                db.query(
                    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                    [answer.title, answer.salary, department.id],
                    function (err) {
                        if (err) throw err;
                        console.log("New role added successfully!");
                        // Call the main menu function to continue
                        mainMenu();
                    }
                );
            });
    });
}

// Function to add an employee
function addEmployee() {
    // Query the database for all roles and employees
    db.query(`SELECT * FROM role`, function (err, roles) {
        if (err) throw err;
        db.query(`SELECT * FROM employee`, function (err, employees) {
            if (err) throw err;
            // Prompt the user to enter the new employee details
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "What is the first name of the new employee?",
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "What is the last name of the new employee?",
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the new employee's role?",
                        choices: roles.map((role) => role.title),
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the new employee's manager?",
                        choices: employees.map(
                            (employee) => `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answer) => {
                    // Get the role ID and manager ID
                    const role = roles.find((r) => r.title === answer.role);
                    const manager = employees.find(
                        (emp) =>
                            `${emp.first_name} ${emp.last_name}` === answer.manager
                    );
                    // Insert the new employee into the database
                    db.query(
                        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                        [answer.first_name, answer.last_name, role.id, manager.id],
                        function (err) {
                            if (err) throw err;
                            console.log("New employee added successfully!");
                            // Call the main menu function to continue
                            mainMenu();
                        }
                    );
                });
        });
    });
}
function updateEmployeeRole() {
    // Query the database for all employees and roles
    db.query(`SELECT * FROM employee`, function (err, employees) {
        if (err) throw err;
        db.query(`SELECT * FROM role`, function (err, roles) {
            if (err) throw err;
            // Prompt the user to select an employee to update
            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Which employee's role would you like to update?",
                        choices: employees.map(
                            (employee) => `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the employee's new role?",
                        choices: roles.map((role) => role.title),
                    },
                ])
                .then((answer) => {
                    const employee = employees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` === answer.employee
                    );
                    const role = roles.find((role) => role.title === answer.role);
                    // Update the employee's role in the database
                    db.query(
                        `UPDATE employee SET role_id = ? WHERE id = ?`,
                        [role.id, employee.id],
                        function (err, result) {
                            if (err) throw err;
                            console.log("Employee role updated successfully!");
                            startApp();
                        }
                    );
                });
        });
    });
}*/

startApp();