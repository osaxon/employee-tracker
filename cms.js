const mysql = require("mysql");
const inquirer = require("inquirer");

require('dotenv').config();

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

const viewAllEmployees = () => {
  console.log("All employees:\n");
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res)
  })
};

const viewEmployeesByDept = () => {
    console.log("Employees by department:\n");
    inquirer.prompt({
        name: 'department',
        message: 'By which department do you want to search?',

    })
    connection.query("SELECT * FROM employee WHERE ", (err, res, rows) => {
      if (err) throw err;
      res.forEach(({id, title, salary, department_id}) => {
          console.table(rows);
      })
    });
};


/*
Need inquirer to build up query string to be passed to mysql db
When searching by department or role, the names should form the choices in inquirer
*/