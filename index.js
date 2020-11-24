const http = require('http');
const url = require('url');
const users = require('./controllers/usersController.js');
const tasks = require('./controllers/tasksController.js');
const projects = require('./controllers/projectsController.js');
const PORT = 2000;

console.log(`Server listen on ${PORT}`);
http
  .createServer((request, response) => {
    let urlParts = url.parse(request.url);
    let updatedPathName = urlParts.pathname;
    const userController = users(response);
    const taskController = tasks(response);
    const projectController = projects(response);
    switch (updatedPathName) {
      case '/':
        if (request.method == 'GET') {
          userController.home();
        } else {
          response.end(
            JSON.stringify({
              status: 405,
              message: 'Method not allowed',
            })
          );
        }
        break;
      case '/users/signup':
        if (request.method == 'POST') {
          let postData = '';
          request.on('data', function (data) {
            postData += data;
          });
          request.on('end', function () {
            userController.signUp(
              JSON.parse(postData),
              request.headers.api_key
            );
          });
        } else {
          response.end(
            JSON.stringify({
              status: 405,
              message: 'Method not allowed',
            })
          );
        }
        break;
      case '/users/login':
        if (request.method == 'POST') {
          let userData = '';
          request.on('data', (data) => {
            userData += data;
          });
          request.on('end', () => {
            userController.signIn(
              JSON.parse(userData),
              request.headers.api_key
            );
          });
        } else {
          response.end(
            JSON.stringify({
              status: 405,
              message: 'Method not allowed',
            })
          );
        }
        break;

      case '/tasks/create':
        if (request.method == 'POST') {
          let taskData = '';
          request.on('data', (data) => {
            taskData += data;
          });
          request.on('end', () => {
            taskController.handleCreateTask(
              JSON.parse(taskData),
              request.headers
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/tasks/delete':
        if (request.method == 'DELETE') {
          let id = urlParts.query.toString().split('=');
          let taskId = id[1];
          taskController.handleDeleteTask(request.headers, parseInt(taskId));
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/tasks/update':
        if (request.method == 'POST') {
          let taskData = '';
          request.on('data', (data) => {
            taskData += data;
          });
          request.on('end', () => {
            taskController.handleUpdateTask(
              JSON.parse(taskData),
              request.headers
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/task':
        if (request.method == 'GET') {
          const params = urlParts.query;
          if (params !== null) {
            const taskId = params.toString().split('=')[1];
            taskController.handleViewTask(request.headers, parseInt(taskId));
          } else taskController.handleViewAllTasks(request.headers);
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/tasks/search':
        if (request.method == 'POST') {
          let taskData = '';
          request.on('data', (data) => {
            taskData += data;
          });
          request.on('end', () => {
            taskController.handleFilterTask(
              JSON.parse(taskData),
              request.headers
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;

      case '/projects/create':
        if (request.method == 'POST') {
          let projectData = '';
          request.on('data', (data) => {
            projectData += data;
          });
          request.on('end', () => {
            projectController.handleCreateProject(
              JSON.parse(projectData),
              request.headers
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/projects/delete':
        if (request.method == 'DELETE') {
          let id = urlParts.query.toString().split('=');
          let projectId = id[1];
          projectController.handleDeleteProject(
            request.headers,
            parseInt(projectId)
          );
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/projects/update':
        if (request.method == 'POST') {
          let projectData = '';
          request.on('data', (data) => {
            projectData += data;
          });
          request.on('end', () => {
            projectController.handleUpdateProject(
              JSON.parse(projectData),
              request.headers
            );
          });
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
      case '/project':
        if (request.method == 'GET') {
          const params = urlParts.query;
          if (params !== null) {
            const projectId = params.toString().split('=')[1];
            projectController.handleViewProject(
              request.headers,
              parseInt(projectId)
            );
          } else projectController.handleViewAllProjects(request.headers);
        } else {
          response.end(
            JSON.stringify({ status: 405, message: 'Method not allowed' })
          );
        }
        break;
    }
  })
  .listen(PORT);
