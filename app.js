const http = require('http')
const env = require('./config/env')
const users = require('./controllers/usersController.js')
const tasks = require('./controllers/tasksController.js')
const projects = require('./controllers/projectsController.js')
const statuses = require('./controllers/statusesController.js')
const { validateUsername, validateNumber, decodeURI } = require('./utils/validation')

const baseURI = `http://localhost:${env.PORT || 2000}`

console.log(`Server listen on ${baseURI}`)
http.createServer((request, response) => {
  const url = new URL(baseURI + decodeURI(request.url))
  const userController = users(response)
  const taskController = tasks(response)
  const projectController = projects(response)
  const statusController = statuses(response)

  switch (url.pathname) {
    case '/':
      if (request.method === 'GET') {
        userController.home()
      } else {
        response.end(
          JSON.stringify({
            status: 405,
            message: 'Method not allowed',
          }),
        )
      }
      break
    case '/users/signup':
      if (request.method === 'POST') {
        let postData = ''
        request.on('data', (data) => {
          postData += data
        })
        request.on('end', () => {
          userController.signUp(
            JSON.parse(postData),
            request.headers.api_key,
          )
        })
      } else {
        response.end(
          JSON.stringify({
            status: 405,
            message: 'Method not allowed',
          }),
        )
      }
      break
    case '/users/login':
      if (request.method === 'POST') {
        let userData = ''
        request.on('data', (data) => {
          userData += data
        })
        request.on('end', () => {
          userController.signIn(
            JSON.parse(userData),
            request.headers.api_key,
          )
        })
      } else {
        response.end(
          JSON.stringify({
            status: 405,
            message: 'Method not allowed',
          }),
        )
      }
      break
    case '/users/logout':
      if (request.method === 'GET') {
        userController.signOut(request.headers)
      } else {
        response.end(
          JSON.stringify({
            status: 405,
            message: 'Method not allowed',
          }),
        )
      }
      break

    case '/tasks/create':
      if (request.method === 'POST') {
        let taskData = ''
        request.on('data', (data) => {
          taskData += data
        })
        request.on('end', () => {
          taskController.handleCreateTask(
            JSON.parse(taskData),
            request.headers,
          )
        })
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/tasks/delete':
      if (request.method === 'DELETE') {
        const taskId = url.searchParams.get('id')
        if (validateNumber(taskId)) {
          taskController.handleDeleteTask(request.headers, taskId)
        } else {
          response.end(
            JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
          )
        }
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/tasks/update':
      if (request.method === 'POST') {
        let taskData = ''
        request.on('data', (data) => {
          taskData += data
        })
        request.on('end', () => {
          taskController.handleUpdateTask(
            JSON.parse(taskData),
            request.headers,
          )
        })
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/task':
      if (request.method === 'GET') {
        const taskId = url.searchParams.get('id')
        if (taskId !== null) {
          if (validateNumber(taskId)) {
            taskController.handleViewTask(request.headers, taskId)
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
        } else taskController.handleViewAllTasks(request.headers)
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/tasks/search':
      if (request.method === 'GET') {
        const keyword = url.searchParams.get('key')
        const projectId = validateNumber(url.searchParams.get('project_id')) ? url.searchParams.get('project_id') : undefined
        const userId = validateNumber(url.searchParams.get('user_id')) ? url.searchParams.get('user_id') : undefined
        const statusId = validateNumber(url.searchParams.get('status_id')) ? url.searchParams.get('status_id') : undefined
        taskController.handleFilterTask({
          keyword, projectId, userId, statusId,
        }, request.headers)
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/tasks/count':
      if (request.method === 'GET') {
        const username = validateUsername(url.searchParams.get('user')) ? url.searchParams.get('user') : undefined
        const projectId = validateNumber(url.searchParams.get('project_id')) ? url.searchParams.get('project_id') : undefined
        const statusId = validateNumber(url.searchParams.get('status_id')) ? url.searchParams.get('status_id') : undefined
        userController.getUserInfo(request.headers, { username, projectId, statusId })
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break

    case '/projects/create':
      if (request.method === 'POST') {
        let projectData = ''
        request.on('data', (data) => {
          projectData += data
        })
        request.on('end', () => {
          projectController.handleCreateProject(
            JSON.parse(projectData),
            request.headers,
          )
        })
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/projects/delete':
      if (request.method === 'DELETE') {
        const projectId = url.searchParams.get('id')
        projectController.handleDeleteProject(
          request.headers,
          parseInt(projectId, 10),
        )
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/projects/update':
      if (request.method === 'POST') {
        let projectData = ''
        request.on('data', (data) => {
          projectData += data
        })
        request.on('end', () => {
          projectController.handleUpdateProject(
            JSON.parse(projectData),
            request.headers,
          )
        })
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    case '/project':
      if (request.method === 'GET') {
        const projectId = url.searchParams.get('id')
        if (projectId !== null) {
          if (validateNumber(projectId)) {
            projectController.handleViewProject(
              request.headers,
              projectId,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
        } else projectController.handleViewAllProjects(request.headers)
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break

    case '/status':
      if (request.method === 'GET') {
        const statusId = url.searchParams.get('id')
        if (validateNumber(statusId)) {
          if (statusId !== null) {
            statusController.handleViewStatus(
              request.headers,
              statusId,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
        } else statusController.handleViewAllStatuses(request.headers)
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
        )
      }
      break
    default:
      response.end(
        JSON.stringify({ status: 405, message: 'Method not allowed' }),
      )
  }
})
  .listen(env.PORT || 2000)
