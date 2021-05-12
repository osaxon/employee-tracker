const mysql = require("mysql");
const inquirer = require("inquirer");

require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "google21",
  database: "cms_DB",
});

connection.connect((err) => {
  if (err) throw err;
  run();
});

const run = () => {
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
        "Update employee",
        "Update employee role",
        "Update employee manager",
        "View all roles",
        "Add a role",
        "Remove a role",
        "exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all employees by department":
          break;

        case "View all employees by manager":
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Remove employee":
          break;

        case "Update employee":
          break;

        case "Update employee role":
          break;

        case "Update employee manager":
          break;

        case "View all roles":
          break;

        case "Add a role":
          break;

        case "Remove a role":
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};

// Prints employee records to console as a table
const viewAllEmployees = () => {
  getEmployees((err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

const viewEmployeesByDept = () => {
  console.log("Employees by department:\n");
  connection.query("SELECT * FROM employee WHERE ", (err, res, rows) => {
    if (err) throw err;
    res.forEach(({ id, title, salary, department_id }) => {
      console.table(rows);
    });
  });
};

const addEmployee = () => {
  let params;
  // maps roles array to key value object for inquirer
  let roles = [];
  getRoles((err, res) => {
    if (err) throw err;
    else
      res.forEach((role) => {
        roles.push({ value: role.id, name: role.title });
      });
  });
  //const rolesQuery = "SELECT roles.id, roles.title from roles";
  //connection.query(rolesQuery, (err, res) => {
  //if (err) throw err;
  //roles = res.map((obj) => ({ value: obj.id, name: obj.title }));
  //});

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name",
      },

      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name",
      },

      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name",
      },
    ])
    .then((answers) => {
      let firstName = answers.firstName;
      let lastName = answers.lastName;
      params = [firstName, lastName];

      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "What role is this new employee?",
          choices: roles,
        },
      ]);
    });
};

// Returns callback containing all entries from employees table
const getEmployees = function (cb) {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department 
    FROM employee 
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN departments ON roles.department_id = departments.id 
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  connection.query(query, (err, res, fields) => {
    if (err) return cb(err);
    cb(null, res);
  });
};

// Returns callback containing all entries from roles table
const getRoles = function (cb) {
  connection.query("SELECT * from roles", (err, res, fields) => {
    if (err) return cb(err);
    cb(null, res);
  });
};
