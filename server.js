const express = require('express'); // Importing express module
const app = express(); // Creating an express app
const inquirer = require('inquirer'); // Importing inquirer module
const mysql = require('mysql2'); // Importing mysql2 module
const consoleTable = require('console.table'); // Importing console.table module

// Function to add a role
function addRole() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err);
      return promptUser();
    }
    const existDepart = results.map(department => ({
      value: department.id,
      name: department.name
    }))
    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'title',
          message: 'What\'s the title of the role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What\'s the salary for this role?'
        },
        {
          type: 'list',
          name: 'department',
          message: 'What department does this belong to?',
          choices: existDepart
        }
      ]
    ).then((answers) => {
      console.log('Role added!');
      let title = answers.title;
      let salary = answers.salary;
      let department = answers.department;
      db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, department], function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.table(`Added: ${title}`);
          viewAllRoles();
          promptUser();
        }
      });
    })
  });
}

// Function to add an employee
function addEmployee() {
  db.query('SELECT * FROM roles', function (err, results) {
    if (err) {
      console.log(err);
      return promptUser();
    }
    const existRole = results.map(role => ({
      value: role.id,
      name: role.title
    }))
    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'firstName',
          message: 'What\'s the person\'s first name?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What\'s the person\'s last name?'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What role would you like?',
          choices: existRole
        }
      ]
    ).then((choiceResponse) => {
      console.log('Employee added!');
      let roleId = choiceResponse.roleId;
      let employeeName = choiceResponse.firstName;
      let employeeLast = choiceResponse.lastName;
      db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)`, [employeeName, employeeLast, roleId], function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.table(`Added: ${employeeName}`);
          viewAllEmployees();
          promptUser();
        }
      });
    })
  });
}

// Function to update employee role
function updateEmployeeRole() {
  db.query('SELECT * FROM employees', function (err, employees) {
    if (err) {
      console.log(err);
      return promptUser();
    }

    const existEmployees = employees.map(employee => ({
      value: employee.id,
      name: `${employee.first_name} ${employee.last_name}`
    }));

    db.query('SELECT * FROM roles', function (err, roles) {
      if (err) {
        console.log(err);
        return promptUser();
      }

      const existRoles = roles.map(role => ({
        value: role.id,
        name: role.title
      }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee do you want to update?',
          choices: existEmployees
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What is the new role for the employee?',
          choices: existRoles
        }
      ]).then((answers) => {
        console.log('Employee role updated!');
        let employeeId = answers.employeeId;
        let roleId = answers.roleId;

        db.query(
          `UPDATE employees SET role_id = ? WHERE id = ?`, [roleId, employeeId], function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(`Updated employee's role.`);
              viewAllEmployees();
            }
            promptUser();
          }
        );
      });
    });
  });
}

// Function to view all employees
function viewAllEmployees() {
  db.query('SELECT * FROM employees', function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.table(results);
    }
    promptUser();
  });
}

// Function to view all roles
function viewAllRoles() {
  db.query('SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles JOIN department ON roles.department_id = department.id', function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.table(results);
    }
    promptUser();
  });
}

// Function to view all departments
function viewAllDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.table(results);
    }
    promptUser();
  });
}

const PORT = process.env.PORT || 3000; // Setting  port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Starting  server
});

promptUser(); 
