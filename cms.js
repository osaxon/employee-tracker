const mysql = require("mysql");
const inquirer = require("inquirer");

require("dotenv").config();

const allEmpQuery = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department
            FROM employee 
            LEFT JOIN roles ON employee.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id`;

const empByMgrQuery = `SELECT employee.id, employee.first_name, employee.last_name 
            WHERE employee.manager_id = ?`;

const rolesQuery = "SELECT roles.id, roles.title from roles";

const deptQuery = "SELECT departments.id, departments.name FROM departments";

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
          viewRecords(allEmpQuery, () => {
            next();
          });
          break;

        case "Add employee":
          addEmployee(() => {
            next();
          });
          break;

        case "Remove employee":
          break;

        case "Update employee":
          updateEmployee();
          break;

        case "View all roles":
          viewRecords(rolesQuery, () => {
            next();
          });
          break;

        case "Add a role":
          addRole(() => {
            next();
          });
          break;

        case "Remove a role":
          break;

        case "View departments":
          viewRecords(deptQuery, () => {
            next();
          });
          break;

        case "Add department":
          addDept();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};

const next = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "next",
        message: "What would you like to do next?",
        choices: ["Main menu", "exit"],
      },
    ])
    .then((answer) => {
      switch (answer.next) {
        case "Main menu":
          run();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
};

const viewRecords = (query, cb) => {
  getRecords(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    cb();
  });
};

const addEmployee = (cb) => {
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
              insertRecord(query, params, allEmpQuery);
            });
        });
    });
};

const addRole = (cb) => {
  var deptChoices = [];

  getRecords(deptQuery, (err, res) => {
    if (err) throw err;
    else
      res.forEach((dept) => {
        deptChoices.push({ value: dept.id, name: dept.name });
      });
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role title",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the role salary",
      },
      {
        type: "list",
        name: "dept",
        message: "Select the department for this role",
        choices: deptChoices,
      },
    ])
    .then((answers) => {
      const params = [answers.title, answers.salary, answers.dept];
      connection.query(
        `INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, ?)`,
        params,
        (err, res) => {
          if (err) throw err;
          console.log("Success! employee added.");
        }
      );
    });
};

const addDept = (cb) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "Enter the name for the new department",
      },
    ])
    .then((answer) => {
      const newDept = answer.dept;
      insertRecord(
        "INSERT INTO departments (name) VALUES (?)",
        newDept,
        deptQuery
      );
    });
};

const updateEmployee = (cb) => {
    var params;
    var roles = [];
    var empChoice = [];

  
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
          let empName = `${employee.first_name} ${employee.last_name}`;
          empChoice.push({ value: employee.id, name: empName });
        });
      // add a null value choice option if employee has no manager
      empChoice.push({ value: null, name: "none" });
    });


    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: "Select the update type",
            choices: ["Role", "Manager"],
        },
    ])
    .then((answer) => {
        const action = answer.action;
        const params = [];

        const changePrompt = [];


        switch (action){
            case "Manager":
                changePrompt.push({
                    type: 'list',
                    name: 'manager',
                    message: "Select the new manager (or select none)",
                    choices: empChoice
                })
                break;
            case "Role":
                changePrompt.push({
                    type: 'list',
                    name: 'role',
                    message: "Select the new role",
                    choices: roles
                })
                break;
            default:
                run();        
        }
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Select the employee to be updated",
                choices: empChoice,
            }
        ])
        .then((answer) => {
            const employee = answer.employee;

            inquirer.prompt(changePrompt).then((answer) => {
                if(answer.role) {
                    params.push(
                        {
                            role_id: answer.role
                        }
                    )
                } else {
                    params.push(
                        {
                            manager_id: answer.manager
                        }
                    )
                }

                params.push({
                    id: employee
                });
                console.log(params)

                const query = `UPDATE employee SET ? WHERE ?`;
                insertRecord(query, params, allEmpQuery);
            })
        })
    })

}

const insertRecord = (insertQuery, params, viewQuery) => {
  connection.query(insertQuery, params, (err, res) => {
    if (err) throw err;
    else console.log("Success, record inserted");
    viewRecords(viewQuery, () => {
      next();
    });
  });
};

const getRecords = function (query, params, cb) {
  connection.query(query, params, (err, res) => {
    if (err) return cb(err);
    cb(null, res);
  });
};
