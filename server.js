// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

// Create database connection
const db = mysql.createPool({
    host: "localhost",
    user: "your_username",
    password: "your_password",
    database: "employee_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Display options to user and prompt for input
async function displayMenu() {
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
            ],
        },
    ]);
    switch (answer.option) {
        case "View all departments":
            return viewAllDepartments();
        case "View all roles":
            return viewAllRoles();
        case "View all employees":
            return viewAllEmployees();
        case "Add a department":
            return addDepartment();
        case "Add a role":
            return addRole();
        case "Add an employee":
            return addEmployee();
        case "Update an employee role":
            return updateEmployeeRole();
        default:
            console.log("Invalid option selected");
            return displayMenu();
    }
}

// Query database for all departments and display in console
async function viewAllDepartments() {
    const [rows] = await db.query("SELECT * FROM department");
    console.table(rows);
    return displayMenu();
}

// Query database for all roles and display in console
async function viewAllRoles() {
    const [rows] = await db.query(`
    SELECT r.id, r.title, r.salary, d.name AS department 
    FROM role r
    INNER JOIN department d ON r.department_id = d.id
  `);
    console.table(rows);
    return displayMenu();
}

// Query database for all employees and display in console
async function viewAllEmployees() {
    const [rows] = await db.query(`
    SELECT e.id, e.first_name, e.last_name, r.title AS role, 
           d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `);
    console.table(rows);
    return displayMenu();
}

// Prompt user for new department name and insert into database
async function addDepartment() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the new department?",
        },
    ]);
    await db.execute("INSERT INTO department (name) VALUES (?)", [answer.name]);
    console.log(`Added ${answer.name} department to the database`);
    return displayMenu();
}

// Prompt user for new role details and insert into database
async function addRole() {
    const [departments] = await db.query("SELECT * FROM department");
    const answer = await inquirer.prompt([
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
            choices: departments.map((department) => department.name),
        },
    ]);

    const department = departments.find(
        (department) => department.name === answer.department
    );

    const role = {
        title: answer.title,
        salary: answer.salary,
        department_id: department.id,
    };

    await db.query("INSERT INTO role SET ?", role);

    console.log(`New role "${role.title}" has been added to the database.`);
    return displayMenu();
}
