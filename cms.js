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

const viewAllEmployees = () => {
  console.log("All employees:\n");

  const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department 
  FROM employee 
  LEFT JOIN roles ON employee.role_id = roles.id 
  LEFT JOIN departments ON roles.department_id = departments.id 
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    run();
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
  let roles;
  const rolesQuery = "SELECT roles.id, roles.title from roles";
  connection.query(rolesQuery, (err, res) => {
    if (err) throw err;
    roles = res.map((obj) => {
      let rObj = {};
      rObj[obj.key] = obj.value;
      return obj;
    });
  });

  inquirer.prompt([
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
      console.log(answers, roles)
      return;
  })


};
