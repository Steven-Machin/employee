const mysql = require('mysql2/promise'); 
const inquirer = require('inquirer');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Password1',
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function viewAllEmployees() {
  const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `;

  const employees = await query(sql);
  console.table(employees);
}
async function viewAllDepartments() {
  const departments = await query('SELECT * FROM department');
  console.table(departments);
}
async function viewAllRoles() {
  const roles = await query('SELECT * FROM role');
  console.table(roles);
}

async function addEmployee() {
  const roles = await query('SELECT * FROM role');
  const managers = await query('SELECT * FROM employee');

  const employeeInfo = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: "Enter employee's first name:",
    },
    {
      name: 'last_name',
      type: 'input',
      message: "Enter employee's last name:",
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select employee role:',
      choices: roles.map(role => ({ name: role.title, value: role.id })),
    },
    {
      name: 'manager_id',
      type: 'list',
      message: 'Select employee manager:',
      choices: [...managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id })), { name: 'None', value: null }],
    },
  ]);

  await query('INSERT INTO employee SET ?', [employeeInfo]);
  console.log('Employee added successfully!');
}

async function addDepartment() {
  const departmentInfo = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter department name:',
    },
  ]);

  await query('INSERT INTO department SET ?', [departmentInfo]);
  console.log('Department added successfully!');
}

async function addRole() {
  const departments = await query('SELECT * FROM department');

  const roleInfo = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter role title:',
    },
    {
      name: 'salary',
      type: 'number',
      message: 'Enter role salary:',
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Select department for the role:',
      choices: departments.map(department => ({ name: department.name, value: department.id })),
    },
  ]);

  await query('INSERT INTO role SET ?', [roleInfo]);
  console.log('Role added successfully!');
}

async function updateEmployeeRole() {
  const employees = await query('SELECT * FROM employee');
  const roles = await query('SELECT * FROM role');

  const updateInfo = await inquirer.prompt([
    {
      name: 'employee_id',
      type: 'list',
      message: 'Select employee to update:',
      choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select new role for the employee:',
      choices: roles.map(role => ({ name: role.title, value: role.id })),
    },
  ]);

  await query('UPDATE employee SET role_id = ? WHERE id = ?', [updateInfo.role_id, updateInfo.employee_id]);
  console.log('Employee role updated successfully!');
}

async function startApp() {
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all employees',
      'View all departments',
      'View all roles',
      'Add employee',
      'Add department',
      'Add role',
      'Update employee role',
      'Exit'
    ],
  });

  switch (action) {
    case 'View all employees':
      await viewAllEmployees();
      break;

    case 'View all departments':
      await viewAllDepartments();
      break;

    case 'View all roles':
      await viewAllRoles();
      break;

    case 'Add employee':
      await addEmployee();
      break;

    case 'Add department':
      await addDepartment();
      break;

    case 'Add role':
      await addRole();
      break;

    case 'Update employee role':
      await updateEmployeeRole();
      break;

    case 'Exit':
      console.log('Exiting application. Goodbye!');
      process.exit();

    default:
      console.log('Invalid action. Please try again.');
      break;
  }

  startApp();
}

startApp();
