const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create a connection to the database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "imthebest",
        database: "employee_db",
    },
    console.log("Connected to the employee_db database.")
);

// Function to start the application
function start() {
    // Prompt the user for what they would like to do
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
            ],
        })
        .then((answer) => {
            // Call the appropriate function based on user choice
            switch (answer.action) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
}

start();
// Function to view all departments
function viewDepartments() {
    // Query the database for all departments
    db.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        // Log the results to the console
        console.table(results);
        // Restart the application
        start();
    });
}

// Function to view all roles
function viewRoles() {
    // Query the database for all roles
    db.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id`,
        function (err, results) {
            if (err) throw err;
            // Log the results to the console
            console.table(results);
            // Restart the application
            start();
        }
    );
}

// Function to view all employees
function viewEmployees() {
    // Query the database for all employees
    db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`,
        function (err, results) {
            if (err) throw err;
            // Log the results to the console
            console.table(results);
            // Restart the application
            start();
        }
    );
}
// Function to add a department
function addDepartment() {
    // Prompt the user for the name of the new department
    inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "What is the name of the new department?",
            },
        ])
        .then(function (answer) {
            // Insert the new department into the database
            db.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.department,
                },
                function (err, results) {
                    if (err) throw err;
                    console.log("New department added successfully!");
                    // Restart the application
                    start();
                }
            );
        });
}

// Function to add a role
function addRole() {
    // Query the database for all departments to use in the inquirer prompt
    db.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        // Prompt the user for the details of the new role
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the title of the new role?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the new role?",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Which department does the new role belong to?",
                    choices: function () {
                        return results.map(function (department) {
                            return {
                                name: department.name,
                                value: department.id,
                            };
                        });
                    },
                },
            ])
            .then(function (answer) {
                // Insert the new role into the database
                db.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department,
                    },
                    function (err, results) {
                        if (err) throw err;
                        console.log("New role added successfully!");
                        // Restart the application
                        start();
                    }
                );
            });
    });
}
