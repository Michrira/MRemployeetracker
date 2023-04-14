INSERT INTO department (name)
VALUES ("Accounting"), ("Finance"), ("Marketing"), ("R&D");

INSERT INTO roles (title, salary, department_id)
VALUES ("employee", 15, 1), ("employee", 15, 2), ("employee", 15, 3), ("employee", 15, 4), ("manager", 30, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Rader", 1, NULL), ("Michael", "Huang", 2, NULL), ("Emma", "Daily", 3, NULL), ("Patricia", "Alberto", 4, NULL), ("Bryan", "Swarthout", 5, NULL);
