// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Create connection to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "imthebest",
    database: "employee_db",
});

// Connect to database
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the employee_db database.");
    // Start the application
    start();
});

// Function to start the application
function start() {
    // Prompt the user to select an action
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Remove employee",
                "Update employee role",
                "Update employee manager",
                "Exit",
            ],
        })
        .then((answer) => {
            // Call the appropriate function based on the user's choice
            switch (answer.action) {
                case "View all employees":
                    viewEmployees();
                    break;
                case "View all employees by department":
                    viewEmployeesByDepartment();
                    break;
                case "View all employees by manager":
                    viewEmployeesByManager();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Remove employee":
                    removeEmployee();
                    break;
                case "Update employee role":
                    updateEmployeeRole();
                    break;
                case "Update employee manager":
                    updateEmployeeManager();
                    break;
                case "Exit":
                    db.end();
                    console.log("Disconnected from the employee_db database.");
                    break;
            }
        });
}

// Function to view all employees
function viewEmployees() {
    // Query the database for all employees
    db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
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

function viewEmployeesByDepartment() {
  // Query the database for all departments
  db.query(`SELECT * FROM department`, function (err, departments) {
    if (err) throw err;
    // Prompt the user to select a department
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Which department would you like to view?",
        choices: departments.map((department) => department.name),
      })
      .then((answer) => {
        // Query the database for all employees in the selected department
        db.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
          FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON employee.manager_id = manager.id
          WHERE department.name = ?`,
          [answer.department],
          function (err, results) {
            if (err) throw err;
            // Log the results to the console
            console.table(results);
            // Restart the application
            start();
          }
        );
      });
  });
}


  // Function to view all employees by manager
  function viewEmployeesByManager() {
                        // Prompt user to select manager
                        inquirer
                            .prompt({
                                name: "manager",
                                type: "list",
                                message: "Which manager would you like to view?",
                                choices: getManagers(),
                            })
                            .then((answer) => {
                                // Query the database for all employees under the selected manager
                                db.query(
                                    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
          FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON employee.manager_id = manager.id
          WHERE CONCAT(manager.first_name, ' ', manager.last_name) = ?`,
                                    [answer.manager],
                                    function (err, results) {
                                        if (err) throw err;
                                        // Log the results to the console
                                        console.table(results);
                                        // Restart the application
                                        start();
                                    }
                                );
                            });
                    }
