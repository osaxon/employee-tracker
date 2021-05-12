const mysql = require("mysql");
const inquirer = require("inquirer");

require("dotenv").config();

const allEmpQuery = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department
            FROM employee 
            LEFT JOIN roles ON employee.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id`;

const rolesQuery = "SELECT roles.id, roles.title from roles";

const deptQuery = "SELECT departments.id, departments.name FROM departments"

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
        "View all employees by manager",
        "Add employee",
        "Remove employee",
        "Update employee",
        "View all roles",
        "Add a role",
        "Remove a role",
        "View departments",
        "Add department",
        "exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all employees":
          viewRecords(allEmpQuery);
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

        case "View all roles":
          viewRecords(rolesQuery);
          break;

        case "Add a role":
            addRole();
          break;

        case "Remove a role":
          break;

        case "View departments":
            viewRecords(deptQuery);
          break;

        case "Add department":
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};



// Prints employee records to console as a table
// const viewAllEmployees = () => {
//   getEmployees((err, res) => {
//     if (err) throw err;
//     console.table(res);
//   });
// };

// const viewAllRoles = () => {
//   getRoles((err, res) => {
//     if (err) throw err;
//     console.table(res);
//   });
// };

const viewRecords = (query) => {
  getRecords(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

const addEmployee = () => {
  var params;
  var roles = [];
  var mgrChoice = [];

  getRecords(rolesQuery, (err, res) => {
    if (err) throw err;
    else
      res.forEach((role) => {
        roles.push({ name: role.title, value: role.id });
      });
  });

  getRecords(allEmpQuery, (err, res) => {
    if (err) throw err;
    else
      res.forEach((employee) => {
        let mgrName = `${employee.first_name} ${employee.last_name}`;
        mgrChoice.push({ value: employee.id, name: mgrName });
      });
    // add a null value choice option if employee has no manager
    mgrChoice.push({ value: null, name: "none" });
  });

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
      console.log(answers);
      let firstName = answers.firstName;
      let lastName = answers.lastName;
      params = [firstName, lastName];

      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "What role is this new employee?",
            choices: roles,
          },
        ])
        .then((answer) => {
          let roleID = answer.role;
          params.push(roleID);

          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Select the employee's manager (or select none)",
                choices: mgrChoice,
              },
            ])
            .then((answer) => {
              let managerID = answer.manager;
              params.push(managerID);

              const query = `
                INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (?, ?, ?, ?)`;

              connection.query(query, params, (err, res) => {
                if (err) throw err;
                viewAllEmployees();
              });
            });
        });
    });
};

const addRole = () => {

    var deptChoices = [];

    getRecords(deptQuery, (err, res) => {
        if (err) throw err;
        else
            res.forEach((dept) => {
            deptChoices.push({ value: dept.id, name: dept.name})
        })
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "Enter the role title",
        },
        {
            type: 'input',
            name: 'salary',
            message: "Enter the role salary"
        },
        {
            type: 'list',
            name: 'dept',
            message: "Select the department for this role",
            choices: deptChoices
        }
    ])
    .then((answers) => {
        const params = [answers.title, answers.salary, answers.dept];
        connection.query(
            `INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, ?)`, params, (err, res) => {
                if (err) throw err;
                viewRecords(rolesQuery);
            }
        )
    })
}

// Returns callback containing all entries from employees table
// const getEmployees = function (cb) {
//   const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department
//     FROM employee 
//     LEFT JOIN roles ON employee.role_id = roles.id 
//     LEFT JOIN departments ON roles.department_id = departments.id 
//     LEFT JOIN employee manager ON employee.manager_id = manager.id`;
//   connection.query(query, (err, res, fields) => {
//     if (err) return cb(err);
//     cb(null, res);
//   });
// };

const getRecords = function (query, cb) {
  connection.query(query, (err, res) => {
    if (err) return cb(err);
    cb(null, res);
  });
};

// Returns callback containing all entries from roles table
const getRoles = function (cb) {
  connection.query(
    "SELECT roles.id, roles.title from roles",
    (err, res, fields) => {
      if (err) return cb(err);
      cb(null, res);
    }
  );
};


