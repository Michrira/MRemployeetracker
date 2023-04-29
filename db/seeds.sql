DROP DATABASE IF EXISTS employees_db;

USE employees_db;

-- departments table

CREATE TABLE
    departments (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL,
        PRIMARY KEY (id)
    );

-- roles table

CREATE TABLE
    roles (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        department_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
    );

-- employees table

CREATE TABLE
    employees (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT NOT NULL,
        manager_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE
        SET NULL
    );

-- seed data for departments table

INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

-- seed data for roles table

INSERT INTO
    roles (title, salary, department_id)
VALUES ('Sales Lead', 100000.00, 1), ('Salesperson', 80000.00, 1), ('Lead Engineer', 150000.00, 2), (
        'Software Engineer',
        120000.00,
        2
    ), ('Accountant', 125000.00, 3), (
        'Legal Team Lead',
        250000.00,
        4
    ), ('Lawyer', 190000.00, 4);

-- seed data for employees table

INSERT INTO
    employees (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES ('John', 'Doe', 1, NULL), ('Mike', 'Smith', 2, 1), ('Sarah', 'Johnson', 3, NULL), ('Adam', 'Lee', 4, 3), ('Karen', 'Williams', 5, 3), ('Robert', 'Jones', 6, 4), ('Rachel', 'Davis', 7, 4);