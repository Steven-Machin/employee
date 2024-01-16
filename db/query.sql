-- View all departments
SELECT id AS department_id, name AS department_name
FROM department
ORDER BY department_name;

-- View all roles
SELECT role.id AS role_id, title AS role_title, salary, department.name AS department_name
FROM role
JOIN department ON role.department_id = department.id
ORDER BY role_title;

-- View all employees
SELECT employee.id AS employee_id, first_name, last_name, role.title AS role_title,
       department.name AS department_name, salary, manager.first_name AS manager_first_name,
       manager.last_name AS manager_last_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id
ORDER BY employee_id;
