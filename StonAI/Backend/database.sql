
CREATE TABLE template
(
    template_id BIGSERIAL NOT NULL,
    template_text VARCHAR,
    PRIMARY KEY (template_id)
);

CREATE TABLE user_template
(
    id BIGSERIAL NOT NULL,
    template_id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE search_history
(
    search_id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    search_text VARCHAR,
    PRIMARY KEY (search_id)
);

CREATE TABLE email
(
    email_id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    subject VARCHAR,
    sender VARCHAR,
    receiver VARCHAR,
    PRIMARY KEY (email_id)
);

CREATE TABLE replies
(
    replies_id BIGSERIAL NOT NULL,
    email_id BIGSERIAL NOT NULL,
    email_reply_id BIGSERIAL NOT NULL,
    PRIMARY KEY (replies_id)
);

CREATE TABLE permissions
(
    permissions_id BIGSERIAL NOT NULL,
    permissions_name VARCHAR,
    PRIMARY KEY (permissions_id)
);

CREATE TABLE roles
(
    role_id BIGSERIAL NOT NULL,
    role_name VARCHAR,
    PRIMARY KEY (role_id)
);

CREATE TABLE roles_permissions
(
    id BIGSERIAL NOT NULL,
    role_id BIGSERIAL NOT NULL,
    permissions_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE user_roles
(
    id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    role_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);



CREATE TABLE subscription
(
    subscription_id BIGSERIAL NOT NULL,
    enterprise_id BIGSERIAL NOT NULL,
    Amount INTEGER, 
    Expiry TIMESTAMP,
    PRIMARY KEY (subscription_id)
);

CREATE TABLE enterprise
(
    enterprise_id BIGSERIAL NOT NULL,
    enterprise_name VARCHAR,
    enterprise_location VARCHAR,
    PRIMARY KEY (enterprise_id)
);


CREATE TABLE document_revision_history
(
    history_id BIGSERIAL NOT NULL,
    document_id BIGSERIAL NOT NULL,
    version_no BIGSERIAL NOT NULL,
    PRIMARY KEY (history_id)
);

CREATE TABLE documents
(
    document_id BIGSERIAL NOT NULL,
    project_id BIGSERIAL NOT NULL,
    document_name VARCHAR,
    PRIMARY KEY (document_id)
);

CREATE TABLE projects
(
    project_id BIGSERIAL NOT NULL,
    project_name VARCHAR,
    PRIMARY KEY (project_id)
);
CREATE TABLE department_project
(
    id BIGSERIAL NOT NULL,
    department_id BIGSERIAL NOT NULL,
    project_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department
(
    department_id BIGSERIAL NOT NULL,
    enterprise_id BIGSERIAL NOT NULL,
    department_name VARCHAR,
    resposibility VARCHAR,
    PRIMARY KEY (department_id)
);


CREATE TABLE task
(
    task_id BIGSERIsAL NOT NULL,
    project_id BIGSERIAL NOT NULL,
    task_name VARCHAR,
    PRIMARY KEY (task_id)
);

CREATE TABLE user_task
(
    id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    task_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users
(
    user_id BIGSERIAL NOT NULL,
    department_id BIGSERIAL NOT NULL,
    username VARCHAR NOT NULL,
    user_password VARCHAR NOT NULL,
    create_at TIMESTAMP DEFAULT Now(),
    modified_at TIMESTAMP,
    PRIMARY KEY (user_id)
);
);
CREATE TABLE knownFeilds
(
    Feild VARCHAR,    
    PRIMARY KEY (Feild)
);
CREATE TABLE aliases
(
    aliases_id BIGSERIAL NOT NULL,
    enterprise_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    Feild VARCHAR,
    element VARCHAR,
    document_category VARCHAR,
    PRIMARY KEY (aliases_id)
);

ALTER TABLE aliases
ADD CONSTRAINT fk_Feild
      FOREIGN KEY(Feild)
	      REFERENCES knownFeilds(Feild);

ALTER TABLE aliases
ADD CONSTRAINT fk_enterprise_id
      FOREIGN KEY(enterprise_id)
	      REFERENCES enterprise(enterprise_id);

ALTER TABLE aliases
ADD CONSTRAINT fk_project_id
      FOREIGN KEY(project_id)
	      REFERENCES projects(project_id);

ALTER TABLE aliases
ADD CONSTRAINT fk_user_id
      FOREIGN KEY(user_id) 
	      REFERENCES users(user_id);


CREATE TABLE task_groups
(
    group_id BIGSERIAL NOT NULL,
    group_name VARCHAR NOT NULL,
    group_color VARCHAR,
        PRIMARY KEY (task_id)

);



ALTER TABLE user_template
  ADD CONSTRAINT FK_template_TO_user_template
    FOREIGN KEY (template_id)
    REFERENCES template (template_id);

ALTER TABLE user_template
  ADD CONSTRAINT FK_user_TO_user_template
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE search_history
  ADD CONSTRAINT FK_user_TO_search_history
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE email
  ADD CONSTRAINT FK_user_TO_email
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE replies
  ADD CONSTRAINT FK_email_TO_replies
    FOREIGN KEY (email_id)
    REFERENCES email (email_id);

ALTER TABLE replies
  ADD CONSTRAINT FK_email_TO_email_replies
    FOREIGN KEY (email_reply_id)
    REFERENCES email (email_id);

ALTER TABLE task
  ADD CONSTRAINT FK_project_TO_task
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

ALTER TABLE user_task
  ADD CONSTRAINT FK_task_TO_user_task
    FOREIGN KEY (task_id)
    REFERENCES task (task_id);

ALTER TABLE user_task
  ADD CONSTRAINT FK_user_TO_user_task
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE users
  ADD CONSTRAINT FK_department_TO_user
    FOREIGN KEY (department_id)
    REFERENCES department (department_id);

ALTER TABLE user_roles
  ADD CONSTRAINT FK_user_TO_user_roles
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE user_roles
  ADD CONSTRAINT FK_roles_TO_user_roles
    FOREIGN KEY (role_id)
    REFERENCES roles (role_id);

ALTER TABLE roles_permissions
  ADD CONSTRAINT FK_roles_TO_roles_permissions
    FOREIGN KEY (role_id)
    REFERENCES roles (role_id);

ALTER TABLE roles_permissions
  ADD CONSTRAINT FK_permissions_TO_roles_permissions
    FOREIGN KEY (permissions_id)
    REFERENCES permissions (permissions_id);

ALTER TABLE department
  ADD CONSTRAINT FK_enterprise_TO_department
    FOREIGN KEY (enterprise_id)
    REFERENCES enterprise (enterprise_id);

ALTER TABLE department_project
  ADD CONSTRAINT FK_department_TO_department_project
    FOREIGN KEY (department_id)
    REFERENCES department (department_id);

ALTER TABLE department_project
  ADD CONSTRAINT FK_project_TO_department_project
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

ALTER TABLE documents
  ADD CONSTRAINT FK_projects_TO_documents
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

ALTER TABLE document_revision_history
  ADD CONSTRAINT FK_documents_TO_document_revision_history
    FOREIGN KEY (document_id)
    REFERENCES documents (document_id);

ALTER TABLE subscription
  ADD CONSTRAINT FK_documents_TO_subscription
    FOREIGN KEY (enterprise_id)
    REFERENCES enterprise (enterprise_id)
    

ALTER TABLE task
  ADD CONSTRAINT FK_taskGroups_to_task
    FOREIGN KEY (group_id)
    REFERENCES task_groups (group_id)
    
    
    
    
    
    ;
-- Executed
ALTER TABLE email
DROP CONSTRAINT fk_user_to_email;

CREATE TABLE accounts
(
    account_id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    email_address VARCHAR NOT NULL,
    account_password VARCHAR NOT NULL,
    create_at TIMESTAMP DEFAULT Now(),
    modified_at TIMESTAMP,
    PRIMARY KEY (account_id)
);

ALTER TABLE accounts
  ADD CONSTRAINT FK_users_TO_accounts
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);


ALTER TABLE email 
DROP COLUMN user_id;


ALTER TABLE email 
ADD COLUMN account_id BIGSERIAL NOT NULL;



ALTER TABLE email
  ADD CONSTRAINT FK_accounts_TO_email
    FOREIGN KEY (account_id)
    REFERENCES accounts(account_id);

ALTER TABLE task
  ADD COLUMN task_creator VARCHAR NOT NULL;
  ADD COLUMN task_assigned_to VARCHAR NOT NULL;
  
  

INSERT INTO enterprise(enterprise_name, enterprise_location)
VALUES ('Zaytrics','Nust')
RETURNING *;


INSERT INTO department(enterprise_id, department_name,resposibility)
VALUES (1,'AI','Developing Ai products')
RETURNING *;

INSERT INTO task(project_id,task_name)
VALUES (3,'Fixing the pool ladder')
RETURNING *;

INSERT INTO task(project_id,task_name)
VALUES (4,'Fixing the Car door')
RETURNING *;

INSERT INTO projects(project_name)
VALUES ('Building a Swimming Pool')
RETURNING *;

INSERT INTO projects(project_name)
VALUES ('Building a Car')
RETURNING *;

INSERT INTO department_project(department_id,project_id)
VALUES (1,4)
RETURNING *;


-- Not Executed

ALTER TABLE user_roles
DROP CONSTRAINT fk_user_to_user_roles;

ALTER TABLE user_roles
DROP CONSTRAINT fk_roles_to_user_roles;

DROP TABLE user_roles;

ALTER TABLE roles_permissions
DROP CONSTRAINT fk_permissions_to_roles_permissions;

ALTER TABLE roles_permissions
DROP CONSTRAINT fk_roles_to_roles_permissions;

DROP TABLE roles_permissions;

CREATE TABLE users_permissions
(
    id BIGSERIAL NOT NULL,
    user_id BIGSERIAL NOT NULL,
    permissions_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE roles_permissions
(
    id BIGSERIAL NOT NULL,
    permissions_id BIGSERIAL NOT NULL,
    role_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE users_permissions
  ADD CONSTRAINT FK_users_TO_users_permissions
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE users_permissions
  ADD CONSTRAINT FK_permissions_TO_users_permissions
    FOREIGN KEY (permissions_id)
    REFERENCES permissions (permissions_id);

ALTER TABLE roles_permissions
  ADD CONSTRAINT FK_roles_TO_roles_permissions
    FOREIGN KEY (role_id)
    REFERENCES roles (role_id);

ALTER TABLE roles_permissions
  ADD CONSTRAINT FK_permissions_TO_roles_permissions
    FOREIGN KEY (permissions_id)
    REFERENCES permissions (permissions_id);

SELECT users.username,roles.role_name 
FROM users 
JOIN users_permissions ON users.user_id=users_permissions.user_id
JOIN permissions ON users_permissions.permissions_id=permissions.permissions_id
JOIN roles_permissions ON users_permissions.permissions_id=roles_permissions.permissions_id
JOIN roles ON roles_permissions.role_id = roles.role_id

SELECT projects.project_name, department.department_name
FROM projects
JOIN department_project ON projects.project_id=department_project.project_id
JOIN department ON department_project.department_id=department.department_id



SELECT task.task_name,projects.project_name, department.department_name,users.username
FROM task
JOIN projects ON task.project_id=projects.project_id
JOIN department_project ON projects.project_id=department_project.project_id
JOIN department ON department_project.department_id=department.department_id
JOIN users ON department.department_id=users.department_id;

SELECT projects.project_name, department.department_name,users.username
FROM projects
JOIN department_project ON projects.project_id=department_project.project_id
JOIN department ON department_project.department_id=department.department_id
JOIN users ON department.department_id=users.department_id;

SELECT users.username, enterprise.enterprise_name, department.department_name, projects.project_name, task.task_name
FROM users
JOIN department ON users.department_id=department.department_id
JOIN department_project ON department.department_id=department_project.department_id
JOIN projects ON department_project.project_id=projects.project_id
JOIN task ON projects.project_id=task.project_id
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id;

--output of above command:

--    task_name        |   project_name   | department_name |    username
------------------------+------------------+-----------------+-----------------
-- Fixing the front gate. | Building a house | BlockChain      | Waqar@gmail.com

ALTER TABLE users ADD CONSTRAINT UNIQUEUsername UNIQUE (username);

SELECT users.username, enterprise.enterprise_name, department.department_name, projects.project_name, task.task_name
FROM users
JOIN department ON users.department_id=department.department_id
JOIN department_project ON department.department_id=department_project.department_id
JOIN projects ON department_project.project_id=projects.project_id
JOIN task ON projects.project_id=task.project_id
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
WHERE users.username = 'Saad@gmail.com';


SELECT users.username, enterprise.enterprise_name, department.department_name
FROM users
JOIN department ON users.department_id=department.department_id
JOIN department_project ON department.department_id=department_project.department_id
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id;

DELETE FROM task WHERE task_name= 'Fixing the Car Paint';

SELECT DISTINCT projects.project_name
FROM users
JOIN department ON users.department_id=department.department_id
JOIN department_project ON department.department_id=department_project.department_id
JOIN projects ON department_project.project_id=projects.project_id
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
WHERE users.username = 'Saad@gmail.com';


SELECT users.username, enterprise.enterprise_name, department.department_name, projects.project_name, task.task_name
FROM users
JOIN department ON users.department_id=department.department_id
JOIN department_project ON department.department_id=department_project.department_id
JOIN projects ON department_project.project_id=projects.project_id
JOIN task ON projects.project_id=task.project_id
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
WHERE users.username = 'Saad@gmail.com' AND projects.project_name='Building a Swimming Pool';

ALTER TABLE task
ADD COLUMN task_status VARCHAR;

Update task 
SET task_status = 'In Progress'
WHERE task_id = task_id
RETURNING *;



ALTER TABLE task
ADD COLUMN task_modified TIMESTAMP DEFAULT Now();

ALTER TABLE task
ADD COLUMN task_deadline TIMESTAMP;



SELECT department.department_name, enterprise.enterprise_name
FROM department 
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
WHERE enterprise.enterprise_id =(
  SELECT enterprise.enterprise_id
  FROM users
  JOIN department ON users.department_id=department.department_id
  JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
  WHERE users.username = 'Saad@gmail.com'
)


  SELECT department.department_name
  FROM users
  JOIN department ON users.department_id=department.department_id
  WHERE users.username = 'Waqar@gmail.com';


BEGIN;
INSERT INTO projects (project_name) VALUES("project_name") RETURNING project_id;
INSERT INTO department_project (project_id,department_id) VALUES(project_id,department_id);

COMMIT;

WITH temp AS (
  INSERT INTO projects (project_name) VALUES('Saad') RETURNING project_id
)
INSERT INTO department_project (project_id,department_id)
SELECT project_id,1
FROM temp

DELETE FROM projects WHERE project_id> 4;
-- Assinged to 
SELECT users.username, assigned.username AS assigned, enterprise.enterprise_name, department.department_name, projects.project_name, task.task_name,task.task_status,task.task_created,task.task_id
            FROM users
            JOIN department ON users.department_id=department.department_id
            JOIN department_project ON department.department_id=department_project.department_id
            JOIN projects ON department_project.project_id=projects.project_id
            JOIN task ON projects.project_id=task.project_id
            JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
            LEFT JOIN user_task ON task.task_id=user_task.task_id
            LEFT JOIN users assigned ON user_task.user_id=assigned.user_id
            WHERE users.username = 'Waqar@gmail.com' AND projects.project_name='Building a house';
 

INSERT INTO department_project(department_id,project_id)
VALUES (1,4)
RETURNING *;


INSERT INTO user_task(user_id,task_id)
VALUES(3,2)
RETURNING *;

SELECT users.username
FROM users
JOIN department ON users.department_id=department.department_id
JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
WHERE enterprise.enterprise_name = (
  SELECT enterprise.enterprise_name
  FROM users
  JOIN department ON users.department_id=department.department_id
  JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
  WHERE users.username = '`+username+`'
)


 
ALTER TABLE users DROP CONSTRAINT fk_department_to_user;
ALTER TABLE users DROP COLUMN department_id;
ALTER TABLE users DROP COLUMN enterprise_id;

ALTER TABLE users ADD COLUMN enterprise_id INTEGER NOT NULL;
ALTER TABLE users
  ADD CONSTRAINT FK_enterprise_TO_users
    FOREIGN KEY (enterprise_id)
    REFERENCES enterprise (enterprise_id);


DELETE FROM users
WHERE user_id = user_id; 

DELETE FROM user_task
WHERE id = id; 

DELETE FROM user_task
WHERE id = id;

DELETE FROM task
WHERE task_id = task_id;

DELETE FROM task
WHERE task_id = task_id;

DELETE FROM accounts
WHERE account_id = account_id;

DELETE FROM email;

ALTER TABLE projects ADD COLUMN enterprise_id INTEGER NOT NULL;
ALTER TABLE projects
  ADD CONSTRAINT FK_enterprise_TO_projects
    FOREIGN KEY (enterprise_id)
    REFERENCES enterprise (enterprise_id);

ALTER TABLE department DROP CONSTRAINT fk_enterprise_to_department;
ALTER TABLE department DROP COLUMN enterprise_id;

ALTER TABLE department ADD COLUMN project_id INTEGER NOT NULL;
ALTER TABLE department
  ADD CONSTRAINT FK_projects_TO_department
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

CREATE TABLE user_department
(
    id BIGSERIAL NOT NULL,
    user_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);



ALTER TABLE user_department
  ADD CONSTRAINT FK_department_TO_user_department
    FOREIGN KEY (department_id)
    REFERENCES department (department_id);

ALTER TABLE user_department
  ADD CONSTRAINT FK_users_TO_user_department
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

DROP TABLE department_project;


INSERT INTO Enterprise (enterprise_name, enterprise_location) VALUES('Zaytrics', 'NSTP') RETURNING *;

INSERT INTO projects (enterprise_id, project_name) VALUES(7, 'Building a Boat') RETURNING *;
INSERT INTO projects (enterprise_id, project_name) VALUES(7, 'Building a Hotel') RETURNING *;

INSERT INTO department (project_id, department_name,resposibility) VALUES(49,'Procurement','Acquiring goods, services, or works from an external source') RETURNING *;
INSERT INTO department (project_id, department_name,resposibility) VALUES(50,'Procurement','Acquiring goods, services, or works from an external source') RETURNING *;

INSERT INTO department (project_id, department_name,resposibility) VALUES(49,'Engineering','Oversee Engineering Processes') RETURNING *;
INSERT INTO department (project_id, department_name,resposibility) VALUES(50,'Engineering','Oversee Engineering Processes') RETURNING *;


INSERT INTO user_department (department_id, user_id) VALUES(4,4) RETURNING *;
INSERT INTO user_department (department_id, user_id) VALUES(6,5) RETURNING *;
INSERT INTO user_department (department_id, user_id) VALUES(5,4) RETURNING *;
INSERT INTO user_department (department_id, user_id) VALUES(7,5) RETURNING *;

INSERT INTO task (project_id, task_name, task_status) VALUES(49,'Installing a Moter', 'In progress') RETURNING *;
INSERT INTO task (project_id, task_name, task_status) VALUES(50,'Installing a Lif', 'In progress') RETURNING *;
INSERT INTO task (project_id, task_name, task_status) VALUES(50,'Installing a Chandelier', 'In progress') RETURNING *;
INSERT INTO task (project_id, task_name, task_status) VALUES(49,'Design the Boat', 'In progress') RETURNING *;

INSERT INTO user_task (user_id, task_id) VALUES(4,33) RETURNING *;
INSERT INTO user_task (user_id, task_id) VALUES(4,35) RETURNING *;
INSERT INTO user_task (user_id, task_id) VALUES(5,36) RETURNING *;
INSERT INTO user_task (user_id, task_id) VALUES(5,37) RETURNING *;

CREATE TABLE user_project
(
    id BIGSERIAL NOT NULL,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE user_project
  ADD CONSTRAINT FK_project_TO_user_project
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

ALTER TABLE user_project
  ADD CONSTRAINT FK_user_TO_user_project
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);


INSERT INTO user_project (user_id, project_id) VALUES(4,49) RETURNING *;
INSERT INTO user_project (user_id, project_id) VALUES(4,50) RETURNING *;
INSERT INTO user_project (user_id, project_id) VALUES(5,49) RETURNING *;
INSERT INTO user_project (user_id, project_id) VALUES(5,50) RETURNING *;

SELECT projects.project_name FROM projects JOIN user_project ON projects.project_id = user_project.project_id JOIN users ON user_project.user_id = users.user_id WHERE users.username = 'Saad@gmail.com';
SELECT * FROM projects JOIN user_project ON projects.project_id = user_project.project_id JOIN users ON user_project.user_id = users.user_id;


ALTER TABLE projects ADD COLUMN plot_number VARCHAR;
ALTER TABLE projects ADD COLUMN sector_number VARCHAR;
ALTER TABLE projects ADD COLUMN area VARCHAR;
ALTER TABLE projects ADD COLUMN city VARCHAR;
ALTER TABLE projects ADD COLUMN county VARCHAR;
ALTER TABLE projects ADD COLUMN country VARCHAR;
ALTER TABLE projects ADD COLUMN project_type VARCHAR;
ALTER TABLE projects ADD COLUMN contract_scope VARCHAR;
ALTER TABLE projects ADD COLUMN work_scope VARCHAR;
ALTER TABLE projects ADD COLUMN start_date TIMESTAMP;
ALTER TABLE projects ADD COLUMN end_date TIMESTAMP;

SELECT users.username, enterprise.enterprise_name, projects.project_name FROM users
JOIN enterprise ON users.enterprise_id = enterprise.enterprise_id
JOIN user_project ON users.user_id = user_project.user_id
JOIN projects ON user_project.project_id = projects.project_id
WHERE users.username = 'Saad@gmail.com';


SELECT projects.project_name,department.department_name FROM projects
JOIN department ON projects.project_id = department.project_id
WHERE projects.project_name='Building a Boat';


CREATE TABLE shop_drawing_submittal
(
  shop_draw_submittal_id BIGSERIAL NOT NULL,
  document_id INTEGER NOT NULL,
  main_contractor VARCHAR,
  client VARCHAR,
  consultant VARCHAR,
  subcontractor VARCHAR,
  project VARCHAR,
  location VARCHAR,
  sds_ref VARCHAR,
  date TIMESTAMP,
  sds_title VARCHAR,
  discipline VARCHAR,
  consultant_name_and_position VARCHAR,
  consultant_signature VARCHAR,
  consultant_date TIMESTAMP,
  consultant_comments VARCHAR,
  contractor_name_and_position VARCHAR,
  contractor_signature VARCHAR,
  contractor_date TIMESTAMP,
  contractor_comments VARCHAR,
  doc_ctrl_name_and_position VARCHAR,
  doc_ctrl_signature VARCHAR,
  doc_ctrl_date TIMESTAMP,
  doc_ctrl_comments VARCHAR,
  PRIMARY KEY (shop_draw_submittal_id)
);
ALTER TABLE shop_drawing_submittal
  ADD CONSTRAINT FK_documents_TO_shop_drawing_submittal
    FOREIGN KEY (document_id)
    REFERENCES documents (document_id);

CREATE TABLE DrawingsList
(
  drawings_list_id BIGSERIAL NOT NULL,
  shop_draw_submittal_id INTEGER NOT NULL,
  drawing_number VARCHAR,
  discription VARCHAR,
  status VARCHAR,
  remarks VARCHAR,
  PRIMARY KEY (drawings_list_id)
);
ALTER TABLE DrawingsList
  ADD CONSTRAINT FK_shop_drawing_submittal_TO_DrawingsList
    FOREIGN KEY (shop_draw_submittal_id)
    REFERENCES shop_drawing_submittal (shop_draw_submittal_id);

CREATE TABLE material_submittal
(
  material_submittal_id BIGSERIAL NOT NULL,
  document_id INTEGER NOT NULL,
  main_contractor VARCHAR,
  client VARCHAR,
  consultant VARCHAR,
  subcontractor VARCHAR,
  project VARCHAR,
  location VARCHAR,
  mts_ref VARCHAR,
  date TIMESTAMP,
  mts_title VARCHAR,
  discipline VARCHAR,
  consultant_name_and_position VARCHAR,
  consultant_signature VARCHAR,
  consultant_date TIMESTAMP,
  consultant_comments VARCHAR,
  contractor_name_and_position VARCHAR,
  contractor_signature VARCHAR,
  contractor_date TIMESTAMP,
  contractor_comments VARCHAR,
  doc_ctrl_name_and_position VARCHAR,
  doc_ctrl_signature VARCHAR,
  doc_ctrl_date TIMESTAMP,
  doc_ctrl_comments VARCHAR,
  PRIMARY KEY (material_submittal_id)
);
ALTER TABLE material_submittal
  ADD CONSTRAINT FK_documents_TO_material_submittal
    FOREIGN KEY (document_id)
    REFERENCES documents (document_id);

CREATE TABLE material_list
(
  material_list_id BIGSERIAL NOT NULL,
  material_submittal_id INTEGER NOT NULL,
  ref_S_B_D VARCHAR,
  discription VARCHAR,
  status VARCHAR,
  remarks VARCHAR,
  PRIMARY KEY (material_list_id)
);
ALTER TABLE material_list
  ADD CONSTRAINT FK_material_submittal_TO_material_list
    FOREIGN KEY (material_submittal_id)
    REFERENCES material_submittal (material_submittal_id);


CREATE TABLE material_submittal_attachment
(
  attachemt_id BIGSERIAL NOT NULL,
  material_submittal_id INTEGER NOT NULL,
  attachemnt_name VARCHAR,
  PRIMARY KEY (attachemt_id)
);
ALTER TABLE material_submittal_attachment
  ADD CONSTRAINT FK_material_submittal_TO_material_submittal_attachment
    FOREIGN KEY (material_submittal_id)
    REFERENCES material_submittal (material_submittal_id);

ALTER TABLE material_submittal
  ADD COLUMN supp_manu VARCHAR
ALTER TABLE material_submittal
  ADD COLUMN location_of_use VARCHAR;
ALTER TABLE material_submittal
  ADD COLUMN status VARCHAR;


ALTER TABLE material_submittal
  ADD COLUMN file_name VARCHAR;
ALTER TABLE shop_drawing_submittal
  ADD COLUMN file_name VARCHAR;

ALTER TABLE shop_drawing_submittal
  DROP COLUMN document_s3_url;


ALTER TABLE documents
  ADD COLUMN revision_number INTEGER;
ALTER TABLE documents
  ADD COLUMN document_category VARCHAR;
---
ALTER TABLE shop_drawing_submittal
  DROP COLUMN doc_ctrl_name_and_position;
ALTER TABLE shop_drawing_submittal
  ADD COLUMN subcontractor_name_and_position VARCHAR;

ALTER TABLE shop_drawing_submittal
  DROP COLUMN doc_ctrl_signature;
ALTER TABLE shop_drawing_submittal
  ADD COLUMN subcontractor_signature VARCHAR;

ALTER TABLE shop_drawing_submittal
  DROP COLUMN doc_ctrl_date;
ALTER TABLE shop_drawing_submittal
  ADD COLUMN subcontractor_date VARCHAR;

ALTER TABLE shop_drawing_submittal
  DROP COLUMN doc_ctrl_comments;
ALTER TABLE shop_drawing_submittal
  ADD COLUMN subcontractor_comments VARCHAR;



ALTER TABLE material_submittal
  DROP COLUMN doc_ctrl_name_and_position;
ALTER TABLE material_submittal
  ADD COLUMN subcontractor_name_and_position VARCHAR;

ALTER TABLE material_submittal
  DROP COLUMN doc_ctrl_signature;
ALTER TABLE material_submittal
  ADD COLUMN subcontractor_signature VARCHAR;

ALTER TABLE material_submittal
  DROP COLUMN doc_ctrl_date;
ALTER TABLE material_submittal
  ADD COLUMN subcontractor_date VARCHAR;

ALTER TABLE material_submittal
  DROP COLUMN doc_ctrl_comments;
ALTER TABLE material_submittal
  ADD COLUMN subcontractor_comments VARCHAR;

UPDATE documents
SET revision_number = 1 
WHERE document_id = 320;

UPDATE documents
SET revision_number = 1 
WHERE document_id = 321;

UPDATE documents
SET document_category = 'material_submittal'
WHERE document_id = 320;

UPDATE documents
SET document_category = 'shop_drawing_submittal' 
WHERE document_id = 321;

ALTER TABLE shop_drawing_submittal
  DROP COLUMN file_name;
ALTER TABLE material_submittal
DROP COLUMN file_name;

ALTER TABLE material_submittal
  ADD COLUMN status VARCHAR;

ALTER TABLE shop_drawing_submittal
  ADD COLUMN status VARCHAR;


INSERT INTO material_submittal (document_id,main_contractor,client,consultant,subcontractor,project,location,mts_ref,date,mts_title,discipline,consultant_name_and_position,consultant_signature,consultant_date,consultant_comments,contractor_name_and_position,contractor_signature,contractor_date,contractor_comments,supp_manu,location_of_use,status,subcontractor_name_and_position,subcontractor_signature,subcontractor_date,subcontractor_comments) 
VALUES(320,'VAMED','BLUE APPLE','HDB','PKE','AL REEM INTEGRATED HEALTHCARE','AL REEM ISLAND, ABU DHABI, UAE','J297/UNEC/MAS/047','23/Jun/19','AUTOMATIC SLIDUBG DOOR SYSTEM','Architectural',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'M/s. White Aluminium','Lobby Rehabiliation',NULL,'Eng.Hassam Alfhili',NULL,'23-6-19',NULL) RETURNING *;

SELECT documents.document_name, documents.document_category , material_submittal.mts_ref, material_submittal.mts_title FROM documents
JOIN material_submittal ON documents.document_id = material_submittal.document_id;

SELECT documents.*, material_submittal.mts_ref FROM documents
JOIN material_submittal ON documents.document_id = material_submittal.document_id 
WHERE documents.document_category = 'material_submittal'
AND material_submittal.mts_ref LIKE '%'

SELECT documents.*, material_submittal.mts_ref, material_submittal.mts_title,material_submittal.status,material_submittal.discipline,material_submittal.location,material_submittal.location_of_use,material_submittal.date,material_submittal.date,material_submittal.main_contractor,material_submittal.project,material_submittal.client,material_submittal.consultant,material_submittal.subcontractor
FROM documents
JOIN material_submittal ON documents.document_id = material_submittal.document_id 
WHERE documents.document_category = 'material_submittal';

SELECT material_submittal.status,material_submittal.discipline,material_submittal.client,material_submittal.date
FROM documents
JOIN material_submittal ON documents.document_id = material_submittal.document_id 
WHERE documents.document_category = 'material_submittal'
AND material_submittal.date between '2019-06-20' and '2019-06-25';
AND material_submittal.date <= 'J297/UNEC/MAS/047'

AND material_submittal.mts_title = 'J297/UNEC/MAS/047'
AND material_submittal.status = 'J297/UNEC/MAS/047'
AND material_submittal.discipline = 'J297/UNEC/MAS/047'
AND material_submittal.location = 'J297/UNEC/MAS/047'
AND material_submittal.location_of_use = 'J297/UNEC/MAS/047'
AND material_submittal.date >= 'J297/UNEC/MAS/047'
AND material_submittal.date <= 'J297/UNEC/MAS/047'
AND material_submittal.main_contractor = 'J297/UNEC/MAS/047'
AND material_submittal.project = 'J297/UNEC/MAS/047'
AND material_submittal.client = 'J297/UNEC/MAS/047'
AND material_submittal.consultant = 'J297/UNEC/MAS/047'
AND material_submittal.subcontractor = 'J297/UNEC/MAS/047';


ALTER TABLE documents
  ADD COLUMN contractor VARCHAR;

UPDATE documents
SET contractor = 'VAMED' 
WHERE document_id = 320;

UPDATE documents
SET contractor = 'VAMED' 
WHERE document_id = 321;

UPDATE documents
SET contractor = 'UNIC' 
WHERE document_id NOT IN (321,320);

SELECT documents.document_category,documents.contractor,shop_drawing_submittal.status,shop_drawing_submittal.discipline
FROM documents
JOIN shop_drawing_submittal ON documents.document_id = shop_drawing_submittal.document_id;

SELECT documents.contractor,material_submittal.status,material_submittal.document_id
FROM documents
JOIN material_submittal ON documents.document_id = material_submittal.document_id;

UPDATE shop_drawing_submittal
SET status = 'Not assigned'
WHERE document_id = 321;

INSERT INTO notifications(message,user_id) 
VALUES('Welcome to StoneAi',4);

INSERT INTO notifications(message,user_id,initiators_id,initiators_name) 
VALUES('Welcome to StoneAi',4,5,'StoneAi');

ALTER TABLE notifications
ADD COLUMN initiators_id INTEGER;

ALTER TABLE notifications
ADD COLUMN picture VARCHAR;

ALTER TABLE notifications
  ADD CONSTRAINT FK_users_TO_notifications
    FOREIGN KEY (initiators_id)
    REFERENCES users (user_id);

ALTER TABLE notifications
ADD COLUMN initiators_name VARCHAR;

ALTER TABLE notifications
ADD COLUMN intiator 

ALTER TABLE notifications
DROP COLUMN initiators_namne;




UPDATE notifications
SET notification_status = 'NotRead';

ALTER TABLE notifications
ADD COLUMN initiated_time TIMESTAMP;

ALTER TABLE notifications
ADD COLUMN notification_status VARCHAR;

ALTER TABLE notifications
DROP  COLUMN initiatored_time;

UPDATE notifications
SET initiated_time = now();

DELETE FROM notifications WHERE notification_id = 2;

ALTER TABLE users
ADD COLUMN number_of_notifications INTEGER;


UPDATE users
SET number_of_notifications = 0;

SELECT  *
FROM    notifications
WHERE   notification_id = ANY(ARRAY[47, 48]);

ALTER TABLE notifications
ADD COLUMN action VARCHAR;


ALTER TABLE notifications
ADD COLUMN document_id INTEGER;

ALTER TABLE notifications
  ADD CONSTRAINT FK_documents_TO_notifications
    FOREIGN KEY (document_id)
    REFERENCES documents (document_id);

ALTER TABLE notifications
ADD COLUMN project_id INTEGER;

ALTER TABLE notifications
  ADD CONSTRAINT FK_projects_TO_notifications
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

UPDATE notifications
SET document_id = 894
WHERE notification_id=116;

ALTER TABLE notifications
DROP  COLUMN project_id;

https://search-stonai-bfgzdexlba4ekpxel72btyewi4.ap-south-1.es.amazonaws.com/

curl -XGET -u 'saad:Zaytrics123?' 'https://search-stonai-bfgzdexlba4ekpxel72btyewi4.ap-south-1.es.amazonaws.com/'
curl -XPUT -u 'saad:Zaytrics123?' 'https://search-stonai-bfgzdexlba4ekpxel72btyewi4.ap-south-1.es.amazonaws.com/stonai/_sumbittal/1'
curl -XGET -u 'saad:Zaytrics123.' 'https://search-stonai-bfgzdexlba4ekpxel72btyewi4.ap-south-1.es.amazonaws.com/stonai/_sumbittal/1' -d'{
    "query" : {
        "match_all" : {}
    }
}'
curl -XGET -u 'saad:Zaytrics123?' 'http://localhost:9200/'
curl -XPUT -u 'saad:Zaytrics123?' 'http://localhost:9200/stonai'

curl -XGET -u 'saad:Zaytrics123.' 'https://search-stonai-bfgzdexlba4ekpxel72btyewi4.ap-south-1.es.amazonaws.com/stonai/_search?q=mars&pretty=true' -d '{"director": "Burton, Tim", "genre": ["Comedy","Sci-Fi"], "year": 1996, "actor": ["Jack Nicholson","Pierce Brosnan","Sarah Jessica Parker"], "title": "Mars Attacks!"}' -H 'Content-Type: application/json'

curl -XPUT -u 'saad:Zaytrics123?' 'http://localhost:9200/_bulk' -d '  {
    "director": "Jaume Collet-Serra, Philip de Blasi",
    "genre": ["Action"],
    "year": 1996,
    "actor": ["Liam Neeson", "Stuart Whelan"],
    "title": "The Commuter"
  }' -H 'Content-Type: application/json'
curl -X POST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' -d'
{ "index" : { "_index" : "my-index-000001", "_id" : "3" } }
{ "foo" : "baz" }
{ "index" : { "_index" : "my-index-000001", "_id" : "4" } }
{ "foo" : "qux" }
'
curl -X POST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' -d'
{ "index" : { "_index" : "my-index-000001", "_id" : "3" } }
{ "foo" : "baz" }
{ "index" : { "_index" : "my-index-000001", "_id" : "4" } }
{ "foo" : "qux" }
'
curl -X POST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' -d'
{ "index" : { "_index" : "my-index-000001", "_id" : "3" } }
{ "foo" : "baz" }
{ "index" : { "_index" : "my-index-000001", "_id" : "4" } }
{ "foo" : "qux" }
'

SELECT * FROM aliases 
JOIN knownFeilds on aliases.feild = knownFeilds.feild
WHERE aliases.enterprise_id = 7;

INSERT INTO knownFeilds(enterprise_id , project_id , user_id , feild , element , document_category , feild)
VALUES ()
MainContractor: extractedFeilds?.mapped_field?.MainContractor ?? "",
      Client: extractedFeilds?.mapped_field?.Client ?? "",
      Consultant: extractedFeilds?.mapped_field?.Consultant ?? "",
      Subcontractor: extractedFeilds?.mapped_field?.Subcontractor ?? "",
      Project: extractedFeilds?.mapped_field?.Project ?? "",
      Location: extractedFeilds?.mapped_field?.Location ?? "",
      Document_title: extractedFeilds?.mapped_field?.Document_title ?? "",
      Discipline: extractedFeilds?.mapped_field?.Discipline ?? "",
      Submittal_no: extractedFeilds?.mapped_field?.Submittal_no ?? "",
      Submittal_Title: extractedFeilds?.mapped_field?.Submittal_Title ?? "",
      subcontractorRep: extractedFeilds?.mapped_field?.subcontractorRep ?? "",
      descOfMaterial: extractedFeilds?.mapped_field?.DescOfMaterial ?? "",
      revision: extractedFeilds?.mapped_field?.Revision ?? "",
      copies: extractedFeilds?.mapped_field?.Copies ?? "",
      locationOfUse: extractedFeilds?.mapped_field?.locationOfUse ?? "",
      ref_Specs_BOQ_Dwg: extractedFeilds?.mapped_field?.Ref_Specs_BOQ_Dwg ?? "",
      date: extractedFeilds?.mapped_field?.Date ?? "",
INSERT INTO knownFeilds(feild)
VALUES ('MainContractor'),
 ('Client'),
 ('Consultant'),
 ('Subcontractor'),
 ('Project'),
 ('Location'),
 ('Document_title'),
 ('Discipline'),
 ('Submittal_no'),
 ('Submittal_Title'),
 ('subcontractorRep'),
 ('descOfMaterial'),
 ('revision'),
 ('copies'),
 ('locationOfUse'),
 ('ref_Specs_BOQ_Dwg'),
 ('Date');


INSERT INTO knownFeilds(enterprise_id,project_id,user_id,feild,element,document_category)
VALUES (7,),
 ('Client'),
 ('Consultant'),
 ('Subcontractor'),
 ('Project'),
 ('Location'),
 ('Document_title'),
 ('Discipline'),
 ('Submittal_no'),
 ('Submittal_Title'),
 ('subcontractorRep'),
 ('descOfMaterial'),
 ('revision'),
 ('copies'),
 ('locationOfUse'),
 ('ref_Specs_BOQ_Dwg'),
 ('Date');





INSERT INTO department(enterprise_id, department_name,resposibility)
VALUES (1,'AI','Developing Ai products')
RETURNING *;

INSERT INTO permissions(,page_ai_search, filter_task)
VALUES (5,'no','no')
RETURNING *;

ALTER TABLE permissions
ADD COLUMN page_ai_search VARCHAR,
ADD COLUMN filter_task VARCHAR

CREATE TABLE permission
(
    permissions_id BIGSERIAL NOT NULL,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    page_ai_search VARCHAR,
    filter_task VARCHAR,
    PRIMARY KEY (permissions_id)
);

ALTER TABLE permission
  ADD CONSTRAINT FK_project_TO_permission
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id);

ALTER TABLE permission
  ADD CONSTRAINT FK_users_TO_permission
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

INSERT INTO permission(user_id,project_id,page_ai_search, filter_task)
VALUES (4,49,'no','no')
RETURNING *;

ALTER TABLE permission
ADD COLUMN add_task VARCHAR(255);

UPDATE permission
SET add_task = 'no'
WHERE user_id = 4;

ALTER TABLE permission
DROP COLUMN page_ai_search ;


ALTER TABLE permission
ADD COLUMN canViewContract BOOLEAN,
ADD COLUMN canUpdateExtractedFeildsContract BOOLEAN,
ADD COLUMN canUpdateAliasesContract BOOLEAN,
ADD COLUMN canDeleteDocumentContract BOOLEAN,
ADD COLUMN canDownloadDocumentContract BOOLEAN,
ADD COLUMN canShareDocumentThoughEmailContract BOOLEAN,
ADD COLUMN canShareDocumentThoughStonAiContract BOOLEAN,
ADD COLUMN canExportDocumentInfoAsExcelFileContract BOOLEAN,
ADD COLUMN canExportExtractedDocumentFieldsAsExcelFileContract BOOLEAN,

ADD COLUMN canViewresponsibilityMatrix BOOLEAN,
ADD COLUMN canUpdateExtractedFeildsresponsibilityMatrix BOOLEAN,
ADD COLUMN canUpdateAliasesresponsibilityMatrix BOOLEAN,
ADD COLUMN canDeleteDocumentresponsibilityMatrix BOOLEAN,
ADD COLUMN canDownloadDocumentresponsibilityMatrix BOOLEAN,
ADD COLUMN canShareDocumentThoughEmailresponsibilityMatrix BOOLEAN,
ADD COLUMN canShareDocumentThoughStonAiresponsibilityMatrix BOOLEAN,
ADD COLUMN canExportDocumentInfoAsExcelFileresponsibilityMatrix BOOLEAN,
ADD COLUMN canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix BOOLEAN,

ADD COLUMN canViewmaterialSubmittal BOOLEAN,
ADD COLUMN canUpdateExtractedFeildsmaterialSubmittal BOOLEAN,
ADD COLUMN canUpdateAliasesmaterialSubmittal BOOLEAN,
ADD COLUMN canDeleteDocumentmaterialSubmittal BOOLEAN,
ADD COLUMN canDownloadDocumentmaterialSubmittal BOOLEAN,
ADD COLUMN canShareDocumentThoughEmailmaterialSubmittal BOOLEAN,
ADD COLUMN canShareDocumentThoughStonAimaterialSubmittal BOOLEAN,
ADD COLUMN canExportDocumentInfoAsExcelFilematerialSubmittal BOOLEAN,
ADD COLUMN canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal BOOLEAN,

ADD COLUMN canViewshopDrawingSubmittal BOOLEAN,
ADD COLUMN canUpdateExtractedFeildsshopDrawingSubmittal BOOLEAN,
ADD COLUMN canUpdateAliasesshopDrawingSubmittal BOOLEAN,
ADD COLUMN canDeleteDocumentshopDrawingSubmittal BOOLEAN,
ADD COLUMN canDownloadDocumentshopDrawingSubmittal BOOLEAN,
ADD COLUMN canShareDocumentThoughEmailshopDrawingSubmittal BOOLEAN,
ADD COLUMN canShareDocumentThoughStonAishopDrawingSubmittal BOOLEAN,
ADD COLUMN canExportDocumentInfoAsExcelFileshopDrawingSubmittal BOOLEAN,
ADD COLUMN canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal BOOLEAN,

ADD COLUMN canViewletter BOOLEAN,
ADD COLUMN canUpdateExtractedFeildsletter BOOLEAN,
ADD COLUMN canUpdateAliasesletter BOOLEAN,
ADD COLUMN canDeleteDocumentletter BOOLEAN,
ADD COLUMN canDownloadDocumentletter BOOLEAN,
ADD COLUMN canShareDocumentThoughEmailletter BOOLEAN,
ADD COLUMN canShareDocumentThoughStonAiletter BOOLEAN,
ADD COLUMN canExportDocumentInfoAsExcelFileletter BOOLEAN,
ADD COLUMN canExportExtractedDocumentFieldsAsExcelFileletter BOOLEAN,

ADD COLUMN canViewminutesOfmeeting BOOLEAN,
ADD COLUMN canUpdateExtractedFeildsminutesOfmeeting BOOLEAN,
ADD COLUMN canUpdateAliasesminutesOfmeeting BOOLEAN,
ADD COLUMN canDeleteDocumentminutesOfmeeting BOOLEAN,
ADD COLUMN canDownloadDocumentminutesOfmeeting BOOLEAN,
ADD COLUMN canShareDocumentThoughEmailminutesOfmeeting BOOLEAN,
ADD COLUMN canShareDocumentThoughStonAiminutesOfmeeting BOOLEAN,
ADD COLUMN canExportDocumentInfoAsExcelFileminutesOfmeeting BOOLEAN,
ADD COLUMN canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting BOOLEAN,

ADD COLUMN canViewpageDashboard BOOLEAN,
ADD COLUMN canViewFilterspageDashboard BOOLEAN,
ADD COLUMN canViewEnterpriseStatisticspageDashboard BOOLEAN,
ADD COLUMN canViewProjectStatisticspageDashboard BOOLEAN,
ADD COLUMN canViewDepartmentStatisticspageDashboard BOOLEAN,
ADD COLUMN canViewUserStatisticspageDashboard BOOLEAN,
ADD COLUMN canViewOrganisationalChartpageDashboard BOOLEAN,

ADD COLUMN canViewpageWorkSpace BOOLEAN,
ADD COLUMN canViewMyTaskpageWorkSpace BOOLEAN,
ADD COLUMN canViewAssingedTaskpageWorkSpace BOOLEAN,
ADD COLUMN canFilterTaskpageWorkSpace BOOLEAN,

ADD COLUMN canViewpageAISearch BOOLEAN,

ADD COLUMN canViewpageMail BOOLEAN,

ADD COLUMN canViewpageFolder BOOLEAN,
ADD COLUMN canViewFilterspageFolder BOOLEAN,
ADD COLUMN canViewDocViewerpageFolder BOOLEAN,

ADD COLUMN canViewpageAccount BOOLEAN,

ADD COLUMN canViewpageSetting BOOLEAN,

ADD COLUMN canViewpageAdmin BOOLEAN,
ADD COLUMN canViewUserspageAdmin BOOLEAN,
ADD COLUMN canViewProjectspageAdmin BOOLEAN,
ADD COLUMN canViewDepartmentspageAdmin BOOLEAN,

ADD COLUMN canViewusers BOOLEAN,
ADD COLUMN canCreateUsersusers BOOLEAN,
ADD COLUMN canDeleteUsersusers BOOLEAN,
ADD COLUMN canUpdateUsersDetailsusers BOOLEAN,
ADD COLUMN canAddUsersToProjectusers BOOLEAN,

ADD COLUMN canViewprojects BOOLEAN,
ADD COLUMN canCreateProjectsprojects BOOLEAN,
ADD COLUMN canDeleteProjectsprojects BOOLEAN,
ADD COLUMN canUpdateProjectsDetailsprojects BOOLEAN,

ADD COLUMN canViewdepartments BOOLEAN,
ADD COLUMN canCreateDepartmentsdepartments BOOLEAN,
ADD COLUMN canDeleteDepartmentsdepartments BOOLEAN,
ADD COLUMN canUpdateDepartmentsdepartments BOOLEAN,

ADD COLUMN canViewworkSpace BOOLEAN,
ADD COLUMN canCreateTaskworkSpace BOOLEAN,
ADD COLUMN canEditTaskworkSpace BOOLEAN,
ADD COLUMN canDeleteTaskworkSpace BOOLEAN,
ADD COLUMN NotifyTaskThroughEmailworkSpace BOOLEAN,
ADD COLUMN NotifyTaskThroughStonAiworkSpace BOOLEAN,
ADD COLUMN canAssignTasktoAnyoneInEnterpriseworkSpace BOOLEAN,
ADD COLUMN canAssingTasktoAnyoneInProjectworkSpace BOOLEAN,
ADD COLUMN canAssingTasktoAnyoneIndepartmentworkSpace BOOLEAN,

ADD COLUMN canViewdocument BOOLEAN,
ADD COLUMN canUplaodDocumentsdocument BOOLEAN,
ADD COLUMN canBulkUploadDocumentsdocument BOOLEAN,
ADD COLUMN canApplyForDocExtractiondocument BOOLEAN,
ADD COLUMN canApplyDocClassificationsdocument BOOLEAN;

canViewContract,
canUpdateExtractedFeildsContract,
canUpdateAliasesContract,
canDeleteDocumentContract,
canDownloadDocumentContract,
canShareDocumentThoughEmailContract,
canShareDocumentThoughStonAiContract,
canExportDocumentInfoAsExcelFileContract,
canExportExtractedDocumentFieldsAsExcelFileContract,
canViewresponsibilityMatrix,
canUpdateExtractedFeildsresponsibilityMatrix,
canUpdateAliasesresponsibilityMatrix,
canDeleteDocumentresponsibilityMatrix,
canDownloadDocumentresponsibilityMatrix,
canShareDocumentThoughEmailresponsibilityMatrix,
canShareDocumentThoughStonAiresponsibilityMatrix,
canExportDocumentInfoAsExcelFileresponsibilityMatrix,
canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix,
canViewmaterialSubmittal,
canUpdateExtractedFeildsmaterialSubmittal,
canUpdateAliasesmaterialSubmittal,
canDeleteDocumentmaterialSubmittal,
canDownloadDocumentmaterialSubmittal,
canShareDocumentThoughEmailmaterialSubmittal,
canShareDocumentThoughStonAimaterialSubmittal,
canExportDocumentInfoAsExcelFilematerialSubmittal,
canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal,
canViewshopDrawingSubmittal,
canUpdateExtractedFeildsshopDrawingSubmittal,
canUpdateAliasesshopDrawingSubmittal,
canDeleteDocumentshopDrawingSubmittal,
canDownloadDocumentshopDrawingSubmittal,
canShareDocumentThoughEmailshopDrawingSubmittal,
canShareDocumentThoughStonAishopDrawingSubmittal,
canExportDocumentInfoAsExcelFileshopDrawingSubmittal,
canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal,
canViewletter,
canUpdateExtractedFeildsletter,
canUpdateAliasesletter,
canDeleteDocumentletter,
canDownloadDocumentletter,
canShareDocumentThoughEmailletter,
canShareDocumentThoughStonAiletter,
canExportDocumentInfoAsExcelFileletter,
canExportExtractedDocumentFieldsAsExcelFileletter,
canViewminutesOfmeeting,
canUpdateExtractedFeildsminutesOfmeeting,
canUpdateAliasesminutesOfmeeting,
canDeleteDocumentminutesOfmeeting,
canDownloadDocumentminutesOfmeeting,
canShareDocumentThoughEmailminutesOfmeeting,
canShareDocumentThoughStonAiminutesOfmeeting,
canExportDocumentInfoAsExcelFileminutesOfmeeting,
canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting,
canViewpageDashboard,
canViewFilterspageDashboard,
canViewEnterpriseStatisticspageDashboard,
canViewProjectStatisticspageDashboard,
canViewDepartmentStatisticspageDashboard,
canViewUserStatisticspageDashboard,
canViewOrganisationalChartpageDashboard,
canViewpageWorkSpace,
canViewMyTaskpageWorkSpace,
canViewAssingedTaskpageWorkSpace,
canFilterTaskpageWorkSpace,
canViewpageAISearch,
canViewpageMail,
canViewpageFolder,
canViewFilterspageFolder,
canViewDocViewerpageFolder,
canViewpageAccount,
canViewpageSetting,
canViewpageAdmin,
canViewUserspageAdmin,
canViewProjectspageAdmin,
canViewDepartmentspageAdmin,
canViewusers,
canCreateUsersusers,
canDeleteUsersusers,
canUpdateUsersDetailsusers,
canAddUsersToProjectusers,
canViewprojects,
canCreateProjectsprojects,
canDeleteProjectsprojects,
canUpdateProjectsDetailsprojects,
canViewdepartments,
canCreateDepartmentsdepartments,
canDeleteDepartmentsdepartments,
canUpdateDepartmentsdepartments,
canViewworkSpace,
canCreateTaskworkSpace,
canEditTaskworkSpace,
canDeleteTaskworkSpace,
NotifyTaskThroughEmailworkSpace,
NotifyTaskThroughStonAiworkSpace,
canAssignTasktoAnyoneInEnterpriseworkSpace,
canAssingTasktoAnyoneInProjectworkSpace,
canAssingTasktoAnyoneIndepartmentworkSpace,
canViewdocument,
canUplaodDocumentsdocument,
canBulkUploadDocumentsdocument,
canApplyForDocExtractiondocument,
canApplyDocClassificationsdocument;

CREATE TABLE tenderAddendumsAliases
(
    tenderAddendumsAliases_id BIGSERIAL NOT NULL,
    enterprise_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (tenderAddendumsAliases_id)
);

ALTER TABLE tenderAddendumsAliases
ADD CONSTRAINT fk_project_id_to_tenderAddendumsAliases
      FOREIGN KEY(project_id)
	      REFERENCES projects(project_id);

ALTER TABLE tenderAddendumsAliases
ADD CONSTRAINT fk_enterprise_id_to_tenderAddendumsAliases
      FOREIGN KEY(enterprise_id)
	      REFERENCES enterprise(enterprise_id);

ALTER TABLE tenderAddendumsAliases
ADD CONSTRAINT fk_user_id_to_tenderAddendumsAliases
      FOREIGN KEY(user_id)
	      REFERENCES users(user_id);

ALTER TABLE tenderAddendumsAliases
ADD COLUMN questionNumber VARCHAR;

ALTER TABLE tenderAddendumsAliases
ADD COLUMN question VARCHAR;

ALTER TABLE tenderAddendumsAliases
ADD COLUMN answer VARCHAR;


CREATE TABLE responsibilityMatrixAliases
(
    responsibilityMatrixAliases_id BIGSERIAL NOT NULL,
    enterprise_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (responsibilityMatrixAliases_id)
);

ALTER TABLE responsibilityMatrixAliases
ADD CONSTRAINT fk_project_id_to_responsibilityMatrixAliases_id
      FOREIGN KEY(project_id)
	      REFERENCES projects(project_id);

ALTER TABLE responsibilityMatrixAliases
ADD CONSTRAINT fk_enterprise_id_to_responsibilityMatrixAliases_id
      FOREIGN KEY(enterprise_id)
	      REFERENCES enterprise(enterprise_id);

ALTER TABLE responsibilityMatrixAliases
ADD CONSTRAINT fk_user_id_to_responsibilityMatrixAliases_id
      FOREIGN KEY(user_id)
	      REFERENCES users(user_id);

ALTER TABLE responsibilityMatrixAliases
ADD COLUMN SerialNumber VARCHAR;

ALTER TABLE responsibilityMatrixAliases
ADD COLUMN ACTIVITY VARCHAR;

ALTER TABLE responsibilityMatrixAliases
ADD COLUMN REMARKS VARCHAR;



CREATE TABLE responsibilityMatrixAliases
(
    responsibilityMatrixAliases_id BIGSERIAL NOT NULL,
    enterprise_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (responsibilityMatrixAliases_id)
);


CREATE TABLE stats
(
    id BIGSERIAL NOT NULL,
    count_tasks INTEGER,
    count_assignedTasks INTEGER,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (responsibilityMatrixAliases_id)
);

CREATE TABLE task_status
(
    id BIGSERIAL NOT NULL,
    task_id BIGSERIAL NOT NULL,
    PRIMARY KEY (id)
);



ALTER TABLE task_status ADD CONSTRAINT task_to_task_statuses FOREIGN KEY(task_id) references task (task_id);
ALTER TABLE task_status ADD CONSTRAINT task_to_task_statuses FOREIGN KEY(task_id) references task (task_id);
ALTER TABLE task_status add column task_status varchar;
 alter table task_status add column status_update_date TIMESTAMP default now();
SELECT * FROM email WHERE email_id IN( SELECT replied_email_id AS email_id from replies WHERE email_id = 'AAMkADhkMTJhN2MzLTQ3MWEtNDc0ZS1hN2Q4LWI5ZWY3NjY5OTlhYgBGAAAAAAAdz2krD8r4QrBzxQu4JAs-BwAV3dOdIxCZS4r7-6q27-4XAAAAAAEMAAAV3dOdIxCZS4r7-6q27-4XAAEO5qbpAAA=');

SELECT * FROM email WHERE email_id = 'AAMkADhkMTJhN2MzLTQ3MWEtNDc0ZS1hN2Q4LWI5ZWY3NjY5OTlhYgBGAAAAAAAdz2krD8r4QrBzxQu4JAs-BwAV3dOdIxCZS4r7-6q27-4XAAAAAAEPAAAV3dOdIxCZS4r7-6q27-4XAAFWYsemAAA=';

INSERT INTO permission (user_id, project_id) VALUES(35, 76) RETURNING *;

Update task 
SET task_status = 'In Progress'
WHERE task_id = task_id
RETURNING *;

Update permission set
            canViewContract=true,
            canUpdateExtractedFeildsContract=true,
            canUpdateAliasesContract=true,
            canDeleteDocumentContract=true,
            canDownloadDocumentContract=true,
            canShareDocumentThoughEmailContract=true,
            canShareDocumentThoughStonAiContract=true,
            canExportDocumentInfoAsExcelFileContract=true,
            canExportExtractedDocumentFieldsAsExcelFileContract=true,
            canViewresponsibilityMatrix=true,
            canUpdateExtractedFeildsresponsibilityMatrix=true,
            canUpdateAliasesresponsibilityMatrix=true,
            canDeleteDocumentresponsibilityMatrix=true,
            canDownloadDocumentresponsibilityMatrix=true,
            canShareDocumentThoughEmailresponsibilityMatrix=true,
            canShareDocumentThoughStonAiresponsibilityMatrix=true,
            canExportDocumentInfoAsExcelFileresponsibilityMatrix=true,
            canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix=true,
            canViewmaterialSubmittal=true,
            canUpdateExtractedFeildsmaterialSubmittal=true,
            canUpdateAliasesmaterialSubmittal=true,
            canDeleteDocumentmaterialSubmittal=true,
            canDownloadDocumentmaterialSubmittal=true,
            canShareDocumentThoughEmailmaterialSubmittal=true,
            canShareDocumentThoughStonAimaterialSubmittal=true,
            canExportDocumentInfoAsExcelFilematerialSubmittal=true,
            canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal=true,
            canViewshopDrawingSubmittal=true,
            canUpdateExtractedFeildsshopDrawingSubmittal=true,
            canUpdateAliasesshopDrawingSubmittal=true,
            canDeleteDocumentshopDrawingSubmittal=true,
            canDownloadDocumentshopDrawingSubmittal=true,
            canShareDocumentThoughEmailshopDrawingSubmittal=true,
            canShareDocumentThoughStonAishopDrawingSubmittal=true,
            canExportDocumentInfoAsExcelFileshopDrawingSubmittal=true,
            canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal=true,
            canViewletter=true,
            canUpdateExtractedFeildsletter=true,
            canUpdateAliasesletter=true,
            canDeleteDocumentletter=true,
            canDownloadDocumentletter=true,
            canShareDocumentThoughEmailletter=true,
            canShareDocumentThoughStonAiletter=true,
            canExportDocumentInfoAsExcelFileletter=true,
            canExportExtractedDocumentFieldsAsExcelFileletter=true,
            canViewminutesOfmeeting=true,
            canUpdateExtractedFeildsminutesOfmeeting=true,
            canUpdateAliasesminutesOfmeeting=true,
            canDeleteDocumentminutesOfmeeting=true,
            canDownloadDocumentminutesOfmeeting=true,
            canShareDocumentThoughEmailminutesOfmeeting=true,
            canShareDocumentThoughStonAiminutesOfmeeting=true,
            canExportDocumentInfoAsExcelFileminutesOfmeeting=true,
            canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting=true,
            canViewpageDashboard=true,
            canViewFilterspageDashboard=true,
            canViewEnterpriseStatisticspageDashboard=true,
            canViewProjectStatisticspageDashboard=true,
            canViewDepartmentStatisticspageDashboard=true,
            canViewUserStatisticspageDashboard=true,
            canViewOrganisationalChartpageDashboard=true,
            canViewpageWorkSpace=true,
            canViewMyTaskpageWorkSpace=true,
            canViewAssingedTaskpageWorkSpace=true,
            canFilterTaskpageWorkSpace=true,
            canViewpageAISearch=true,
            canViewpageMail=true,
            canViewpageFolder=true,
            canViewFilterspageFolder=true,
            canViewDocViewerpageFolder=true,
            canViewpageAccount=true,
            canViewpageSetting=true,
            canViewpageAdmin=true,
            canViewUserspageAdmin=true,
            canViewProjectspageAdmin=true,
            canViewDepartmentspageAdmin=true,
            canViewusers=true,
            canCreateUsersusers=true,
            canDeleteUsersusers=true,
            canUpdateUsersDetailsusers=true,
            canAddUsersToProjectusers=true,
            canViewprojects=true,
            canCreateProjectsprojects=true,
            canDeleteProjectsprojects=true,
            canUpdateProjectsDetailsprojects=true,
            canViewdepartments=true,
            canCreateDepartmentsdepartments=true,
            canDeleteDepartmentsdepartments=true,
            canUpdateDepartmentsdepartments=true,
            canViewworkSpace=true,
            canCreateTaskworkSpace=true,
            canEditTaskworkSpace=true,
            canDeleteTaskworkSpace=true,
            NotifyTaskThroughEmailworkSpace=true,
            NotifyTaskThroughStonAiworkSpace=true,
            canAssignTasktoAnyoneInEnterpriseworkSpace=true,
            canAssingTasktoAnyoneInProjectworkSpace=true,
            canAssingTasktoAnyoneIndepartmentworkSpace=true,
            canViewdocument=true,
            canUplaodDocumentsdocument=true,
            canBulkUploadDocumentsdocument=true,
            canApplyForDocExtractiondocument=true,
            canApplyDocClassificationsdocument=true where permissions_id = 1;

Update permission set
            canDeleteTaskGroup=true,
            canEditTaskGroup=true where permissions_id = 1;

INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(141,'In Process','1999-01-08 04:05:06');
INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(141,'Completed','1999-01-09 04:05:06');
INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(141,'Delayed','1999-01-10 04:05:06');
INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(141,'Canceled','1999-01-11 04:05:06');
INSERT INTO task_status VALUES(141,'Completed',"1999-01-09 04:05:06");
INSERT INTO task_status VALUES(141,"Delayed","1999-01-10 04:05:06");
INSERT INTO task_status VALUES(141,"Canceled","1999-01-11 04:05:06");

INSERT INTO task_status VALUES(142,"In Process","1999-01-12 04:05:06");
INSERT INTO task_status VALUES(142,"Completed","1999-01-13 04:05:06");
INSERT INTO task_status VALUES(142,"Delayed","1999-01-14 04:05:06");
INSERT INTO task_status VALUES(142,"Canceled","1999-01-14 04:05:06");

INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(142,'In Process','1999-01-12 04:05:06');
INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(142,'Completed','1999-01-13 04:05:06');
INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(142,'Delayed','1999-01-14 04:05:06');
INSERT INTO task_status (task_id,task_status,status_update_date)VALUES(142,'Canceled','1999-01-15 04:05:06');

DELETE FROM task_status WHERE id = 8;

SELECT task_status.task_id,status_update_date, MAX(status_update_date)
FROM task_status
GROUP BY task_id;

select
 task_status, count(task_status)
from
  task_status
where
  status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id) 
  AND status_update_date BETWEEN '1995-02-01' AND '2000-02-28'
GROUP BY task_status.task_status;




INSERT INTO permission (project_id,user_id)VALUES(87,44);

CREATE TABLE kpi
(
    kpi_id BIGSERIAL NOT NULL,
    department_id INTEGER,
    user_id INTEGER,
    project_id INTEGER,
    search_date TIMESTAMP,
    search_type VARCHAR,
    PRIMARY KEY kpi_id,
    UNIQUE (user_id, project_id, search_date, search_type)
);

-- Creating an enterprise
INSERT INTO Enterprise (enterprise_name, enterprise_location) VALUES('Zaytrics22', 'NSTP2') RETURNING *;

////Permissions
insert into permission (
    user_id,
project_id,
canViewContract,
            canUpdateExtractedFeildsContract,
            canUpdateAliasesContract,
            canDeleteDocumentContract,
            canDownloadDocumentContract,
            canShareDocumentThoughEmailContract,
            canShareDocumentThoughStonAiContract,
            canViewresponsibilityMatrix,
            canUpdateExtractedFeildsresponsibilityMatrix,
            canUpdateAliasesresponsibilityMatrix,
            canDeleteDocumentresponsibilityMatrix,
            canDownloadDocumentresponsibilityMatrix,
            canShareDocumentThoughEmailresponsibilityMatrix,
            canShareDocumentThoughStonAiresponsibilityMatrix,
            canViewmaterialSubmittal,
            canUpdateExtractedFeildsmaterialSubmittal,
            canUpdateAliasesmaterialSubmittal,
            canDeleteDocumentmaterialSubmittal,
            canDownloadDocumentmaterialSubmittal,
            canShareDocumentThoughEmailmaterialSubmittal,
            canShareDocumentThoughStonAimaterialSubmittal,
            canExportDocumentInfoAsExcelFilematerialSubmittal,
            canViewshopDrawingSubmittal,
            canUpdateExtractedFeildsshopDrawingSubmittal,
            canUpdateAliasesshopDrawingSubmittal,
            canDeleteDocumentshopDrawingSubmittal,
            canDownloadDocumentshopDrawingSubmittal,
            canShareDocumentThoughEmailshopDrawingSubmittal,
            canShareDocumentThoughStonAishopDrawingSubmittal,
            canExportDocumentInfoAsExcelFileshopDrawingSubmittal,
            canViewletter,
            canUpdateExtractedFeildsletter,
            canUpdateAliasesletter,
            canDeleteDocumentletter,
            canDownloadDocumentletter,
            canShareDocumentThoughEmailletter,
            canShareDocumentThoughStonAiletter,
            canViewminutesOfmeeting,
            canUpdateExtractedFeildsminutesOfmeeting,
            canUpdateAliasesminutesOfmeeting,
            canDeleteDocumentminutesOfmeeting,
            canDownloadDocumentminutesOfmeeting,
            canShareDocumentThoughEmailminutesOfmeeting,
            canShareDocumentThoughStonAiminutesOfmeeting,
            canViewpageWorkSpace,
            canViewAssingedTaskpageWorkSpace,
            canFilterTaskpageWorkSpace,
            canViewpageAISearch,
            canViewpageMail,
            canViewpageFolder,
            canViewpageAccount,
            canViewpageSetting,
            canViewpageAdmin,
            canViewUserspageAdmin,
            canViewProjectspageAdmin,
            canViewDepartmentspageAdmin,
            canViewusers,
            canCreateUsersusers,
            canDeleteUsersusers,
            canUpdateUsersDetailsusers,
            canAddUsersToProjectusers,
            canViewprojects,
            canCreateProjectsprojects,
            canDeleteProjectsprojects,
            canUpdateProjectsDetailsprojects,
            canViewdepartments,
            canCreateDepartmentsdepartments,
            canDeleteDepartmentsdepartments,
            canUpdateDepartmentsdepartments,
            canCreateTaskworkSpace,
            canEditTaskworkSpace,
            canDeleteTaskworkSpace,
            canDeleteTaskGroup,
            canEditTaskGroup,
            canViewdocument,
            canUplaodDocumentsdocument,
            canBulkUploadDocumentsdocument,
            canApplyForDocExtractiondocument,
            canViewBoq,
            canUpdateExtractedFeildsBoq,
            canDeleteDocumentBoq,
            canDownloadDocumentBoq,
            canShareDocumentThoughEmailBoq,
            canShareDocumentThoughStonAiBoq,
            canViewTender,
            canUpdateExtractedFeildsTender,
            canUpdateAliasesTender,
            canDeleteDocumentTender,
            canDownloadDocumentTender,
            canShareDocumentThoughEmailTender,
            canShareDocumentThoughStonAiTender,
            canViewBucket,
            canDeleteDocumentBucket,
            canDownloadDocumentBucket,
            canShareDocumentThoughEmailBucket,
            canShareDocumentThoughStonAiBucket) 
            values(

                103,
                101
            ,true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
            ,true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
        
            true);


             CREATE TABLE subcontractor (
	user_id serial PRIMARY KEY,
  name VARCHAR,
	country VARCHAR,
	location VARCHA,
	manager_name VARCHAR ,
  manager_email_address ,
  scope varchar,
  contract_type varchar,
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE projects ADD COLUMN abbreviation_project VARCHAR;
ALTER TABLE projects ADD COLUMN abbreviation_contractor VARCHAR;




Update projects 
SET abbreviation_contractor = 'VEE'
WHERE project_id = 49
RETURNING *;

Update projects 
SET abbreviation_project = 'BAH'
WHERE project_id = 49
RETURNING *;

CREATE TABLE generated_sumbittals_no 
(
    id BIGSERIAL NOT NULL,
    project_id INTEGER NOT NULL,
    abbreviation_project VARCHAR NOT NULL,
    abbreviation_contractor VARCHAR NOT NULL,
    serial_no INTEGER NOT NULL,
    revision_number INTEGER NOT NULL,
    cover_page_id INTEGER NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE user_documentList_columns 
(
    user_id INTEGER NOT NULL,
    columns VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
);

ALTER TABLE user_documentList_columns
ADD CONSTRAINT fk_user_id
      FOREIGN KEY(user_id)
	      REFERENCES users(user_id);

DROP TABLE generated_sumbittalsNo;


-- prequalificationsubmittal
canviewprequalificationsubmittal
canupdateextractedfeildsprequalificationsubmittal
cansharedocumentthoughemailprequalificationsubmittal
candeletedocumentprequalificationsubmittal
candownloaddocumentprequalificationsubmittal

--technicalsubmittal
canviewtechnicalsubmittal
canupdateextractedfeildstechnicalsubmittal
cansharedocumentthoughemailtechnicalsubmittal
candeletedocumenttechnicalsubmittal
candownloaddocumenttechnicalsubmittal

--methodstatementsubmittal
canviewmethodstatementsubmittal
canupdateextractedfeildsmethodstatementsubmittal
cansharedocumentthoughemailmethodstatementsubmittal
candeletedocumentmethodstatementsubmittal
candownloaddocumentmethodstatementsubmittal

--requestforinformation
canviewrequestforinformation
canupdateextractedfeildsrequestforinformation
cansharedocumentthoughemailrequestforinformation
candeletedocumentrequestforinformation
candownloaddocumentrequestforinformation

--materialinspectionrequest
canviewmaterialinspectionrequest
canupdateextractedfeildsmaterialinspectionrequest
cansharedocumentthoughemailmaterialinspectionrequest
candeletedocumentmaterialinspectionrequest
candownloaddocumentmaterialinspectionrequest

--workinspectionrequest
canviewworkinspectionrequest
canupdateextractedfeildsworkinspectionrequest
cansharedocumentthoughemailworkinspectionrequest
candeletedocumentworkinspectionrequest
candownloaddocumentworkinspectionrequest

--architecturalinspectionrequest
canviewarchitecturalinspectionrequest
canupdateextractedfeildsarchitecturalinspectionrequest
cansharedocumentthoughemailarchitecturalinspectionrequest
candeletedocumentarchitecturalinspectionrequest
candownloaddocumentarchitecturalinspectionrequest

--nonconformancereport
canviewnonconformancereport
canupdateextractedfeildsnonconformancereport
cansharedocumentthoughemailnonconformancereport
candeletedocumentnonconformancereport
candownloaddocumentnonconformancereport

--siteinstruction
canviewsiteinstruction
canupdateextractedfeildssiteinstruction
cansharedocumentthoughemailsiteinstruction
candeletedocumentsiteinstruction
candownloaddocumentsiteinstruction


ALTER TABLE permission
ADD COLUMN canviewprequalificationsubmittal BOOLEAN,
ADD COLUMN canupdateextractedfeildsprequalificationsubmittal BOOLEAN,
ADD COLUMN cansharedocumentthoughemailprequalificationsubmittal BOOLEAN,
ADD COLUMN candeletedocumentprequalificationsubmittal BOOLEAN,
ADD COLUMN candownloaddocumentprequalificationsubmittal BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfileprequalificationsubmittal BOOLEAN,

ADD COLUMN canviewtechnicalsubmittal BOOLEAN,
ADD COLUMN canupdateextractedfeildstechnicalsubmittal BOOLEAN,
ADD COLUMN cansharedocumentthoughemailtechnicalsubmittal BOOLEAN,
ADD COLUMN candeletedocumenttechnicalsubmittal BOOLEAN,
ADD COLUMN candownloaddocumenttechnicalsubmittal BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfiletechnicalsubmittal BOOLEAN,

ADD COLUMN canviewmethodstatementsubmittal BOOLEAN,
ADD COLUMN canupdateextractedfeildsmethodstatementsubmittal BOOLEAN,
ADD COLUMN cansharedocumentthoughemailmethodstatementsubmittal BOOLEAN,
ADD COLUMN candeletedocumentmethodstatementsubmittal BOOLEAN,
ADD COLUMN candownloaddocumentmethodstatementsubmittal BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfilemethodstatementsubmittal BOOLEAN,

ADD COLUMN canviewrequestforinformation BOOLEAN,
ADD COLUMN canupdateextractedfeildsrequestforinformation BOOLEAN,
ADD COLUMN cansharedocumentthoughemailrequestforinformation BOOLEAN,
ADD COLUMN candeletedocumentrequestforinformation BOOLEAN,
ADD COLUMN candownloaddocumentrequestforinformation BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfilerequestforinformation BOOLEAN,

ADD COLUMN canviewmaterialinspectionrequest BOOLEAN,
ADD COLUMN canupdateextractedfeildsmaterialinspectionrequest BOOLEAN,
ADD COLUMN cansharedocumentthoughemailmaterialinspectionrequest BOOLEAN,
ADD COLUMN candeletedocumentmaterialinspectionrequest BOOLEAN,
ADD COLUMN candownloaddocumentmaterialinspectionrequest BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfilematerialinspectionrequest BOOLEAN,

ADD COLUMN canviewworkinspectionrequest BOOLEAN,
ADD COLUMN canupdateextractedfeildsworkinspectionrequest BOOLEAN,
ADD COLUMN cansharedocumentthoughemailworkinspectionrequest BOOLEAN,
ADD COLUMN candeletedocumentworkinspectionrequest BOOLEAN,
ADD COLUMN candownloaddocumentworkinspectionrequest BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfileworkinspectionrequest BOOLEAN,

ADD COLUMN canviewarchitecturalinspectionrequest BOOLEAN,
ADD COLUMN canupdateextractedfeildsarchitecturalinspectionrequest BOOLEAN,
ADD COLUMN cansharedocumentthoughemailarchitecturalinspectionrequest BOOLEAN,
ADD COLUMN candeletedocumentarchitecturalinspectionrequest BOOLEAN,
ADD COLUMN candownloaddocumentarchitecturalinspectionrequest BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfilearchitecturalinspectionrequest BOOLEAN,

ADD COLUMN canviewnonconformancereport BOOLEAN,
ADD COLUMN canupdateextractedfeildsnonconformancereport BOOLEAN,
ADD COLUMN cansharedocumentthoughemailnonconformancereport BOOLEAN,
ADD COLUMN candeletedocumentnonconformancereport BOOLEAN,
ADD COLUMN candownloaddocumentnonconformancereport BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfilenonconformancereport BOOLEAN,

ADD COLUMN canviewsiteinstruction BOOLEAN,
ADD COLUMN canupdateextractedfeildssiteinstruction BOOLEAN,
ADD COLUMN cansharedocumentthoughemailsiteinstruction BOOLEAN,
ADD COLUMN candeletedocumentsiteinstruction BOOLEAN,
ADD COLUMN candownloaddocumentsiteinstruction BOOLEAN,
ADD COLUMN canexportdocumentinfoasexcelfilesiteinstruction BOOLEAN;


create table group_task(id bigserial not null
,user_id bigserial not null,group_id bigserial 
not null,project_id bigserial not null,primary key(id),foreign key(user_id) references users(user_id),foreign key(group_id) references task_groups(group_id),foreign key(project_id) references projects(project_id));
);

create table task_attachments(id bigserial not null,task_id bigserial not null,project_id bigserial not null,primary key(id),foreign key(task_id) references tasks(task_id),foreign key(project_id) references projects(project_id));


ALTER TABLE projects
ADD COLUMN Shop_Drawing_Submital INTEGER,
ADD COLUMN Material_Submittal INTEGER,
ADD COLUMN Site_Instruction INTEGER,
ADD COLUMN Meterial_Inspection_Request INTEGER,
ADD COLUMN Technical_Submittal INTEGER,
ADD COLUMN Method_Statement_Submittal INTEGER,
ADD COLUMN Non_Conformance_Report INTEGER,
ADD COLUMN Prequalification_Submittal INTEGER,
ADD COLUMN Request_for_Information INTEGER,
ADD COLUMN Work_Inspection_Request INTEGER,
ADD COLUMN Architectural_Inspection_Request INTEGER;


  { label: "Shop Drawing Submital" },
  { label: "Material Submittal" },
  { label: "Site Instruction" },
  { label: "Meterial Inspection Request" },
  { label: "Technical Submittal" },
  { label: "Method Statement Submittal" },
  { label: "Non Conformance Report" },
  { label: "Prequalification Submittal" },
  { label: "Request for Information" },
  { label: "Work Inspection Request" },
  { label: "Architectural Inspection Request" },