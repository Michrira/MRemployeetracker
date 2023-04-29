const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'imthebest',
  database: 'employees_db'
})
console.log('Connect to the database');

// connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  mainPrompt();
});

// function for inital prompt
function mainPrompt() {
  inquirer
  .prompt({
      type: 'list',
      name: 'option',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then((answers) => {
      switch (answers.option) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() { 
  // SQL query to retrieve all departments
  const query = 'SELECT * FROM departments';

connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(res);
    console.table(res);
    mainPrompt();
  });
}
//function to view all roles
function viewAllRoles() {
  const query = 'SELECT * FROM roles';

  connection.query(query, (err, res) => {
    console.log(res);
    console.table(res);
    mainPrompt();
  })
}

function viewAllEmployees() {
  // SQL query to retrieve all employees with relevant information
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name,
      roles.title, departments.name AS department, roles.salary,
      CONCAT(managers.first_name, ' ', managers.last_name) AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
}

// function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?',
    })
    .then((answer) => {
      const query = 'INSERT INTO departments SET ?';

      connection.query(query, { name: answer.name }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Added ${answer.name} to departments`);
        }
        mainPrompt();
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role you would like to add?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role you would like to add?',
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID of the role you would like to add?',
      },
    ])
    .then((answers) => {
      const query = 'INSERT INTO roles SET ?';

      connection.query(query, answers, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${res.affectedRows} role inserted!\n`);
        }
        mainPrompt();
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function addEmployee() {
  const query = 'SELECT id, first_name, last_name FROM employees';
  connection.query(query, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    const managersChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    // Add a null option for manager
    managersChoices.unshift({ name: 'None', value: null });

    const query2 = 'SELECT id, title FROM roles';
    connection.query(query2, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      const rolesChoices = res.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "What is the employee's first name?",
        },
        {
          type: 'input',
          name: 'last_name',
          message: "What is the employee's last name?",
        },
        {
          type: 'list',
          name: 'role_id',
          message: "What is the employee's role?",
          choices: rolesChoices,
        },
        {
          type: 'list',
          name: 'manager_id',
          message: "Who is the employee's manager?",
          choices: managersChoices,
        },
      ]).then((answers) => {
        const query = 'INSERT INTO employees SET ?';
        connection.query(query, answers, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Added ${answers.first_name} ${answers.last_name} to employees`);
          }
          mainPrompt();
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  });
}

//update an employee role
function updateEmployeeRole() {
  const query1 = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees';
  connection.query(query1, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    const employeesChoices = res.map(({ id, name }) => ({ name: name, value: id }));
    inquirer.prompt({
      type: 'list',
      name: 'employee_id',
      message: 'Which employee would you like to update?',
      choices: employeesChoices
    }).then((employeeAnswer) => {
      const query2 = 'SELECT id, title FROM roles';
      connection.query(query2, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        const rolesChoices = res.map(role => ({
          name: role.title,
          value: role.id,
        }));
        inquirer.prompt({
          type: 'list',
          name: 'role_id',
          message: 'What is the employee\'s new role?',
          choices: rolesChoices
        }).then((roleAnswer) => {
          const query3 =
            'UPDATE employees SET role_id = ? WHERE id = ?';
          connection.query(query3, [roleAnswer.role_id, employeeAnswer.employee_id], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(`${res.affectedRows} employee updated!\n`);
          });
        });
      });
    });
  });
}
mainPrompt();