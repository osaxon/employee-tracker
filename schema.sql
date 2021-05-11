DROP DATABASE IF EXISTS cms_DB;
CREATE DATABASE cms_DB;

USE cms_DB;

CREATE TABLE departments(
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

INSERT INTO employee(first_name, last_name, role_id)
VALUES ("Oliver", "Saxon", 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Luke", "Saxon", 2, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Harriet", "Saxon", 2, 1);

INSERT INTO roles(title, salary, department_id)
VALUES ("Junior Dev", 28500.00, 1);

INSERT INTO roles(title, salary, department_id)
VALUES ("Senior Dev", 38500.00, 1);

INSERT INTO roles(title, salary, department_id)
VALUES ("Dev Lead", 58500.00, 1);

INSERT INTO roles(title, salary, department_id)
VALUES ("Project Manager", 45500.00, 2);

INSERT INTO roles(title, salary, department_id)
VALUES ("Business Analyst", 32500.00, 2);

INSERT INTO roles(title, salary, department_id)
VALUES ("Change Manager", 34500.00, 2);

INSERT INTO roles(title, salary, department_id)
VALUES ("Network Engineer", 45500.00, 3);

INSERT INTO roles(title, salary, department_id)
VALUES ("Infrastructure Engineer", 45500.00, 3);

INSERT INTO roles(title, salary, department_id)
VALUES ("Infrastructure Lead", 65500.00, 3);

INSERT INTO departments(name)
VALUES("DevOps");

INSERT INTO departments(name)
VALUES("Service Operations");

INSERT INTO departments(name)
VALUES("Infrastructure Operations");

SELECT * FROM employee;
SELECT * FROM roles;
SELECT * FROM departments;

