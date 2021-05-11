const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "google21",
  database: "cms_DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Welcome to the Employee Tracker CMS...`);
  run();
});

const run = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add a new record", "View records", "Update a record", "exit"],
    })
    .then((anser) => {
      switch (answer.action) {
        case "View all employees":
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

        case "exit":
          connection.end();
          break;
      }
    });
};
