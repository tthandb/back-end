const http = require('http')
const env = require('./config/env')
const users = require('./controllers/usersController.js')
const tasks = require('./controllers/tasksController.js')
const projects = require('./controllers/projectsController.js')
const statuses = require('./controllers/statusesController.js')
const { escapeHtml } = require('./utils/security')
const { validateUsername, validateNumber, decodeURI } = require('./utils/security')

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
          const dataParse = JSON.parse(postData)
          if (validateUsername(dataParse.username) && dataParse.password !== undefined) {
            dataParse.username = escapeHtml(dataParse.username)
            userController.signUp(
              dataParse,
              request.headers.api_key,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
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
          const dataParse = JSON.parse(userData)
          if (validateUsername(dataParse.username) && dataParse.password !== undefined) {
            dataParse.username = escapeHtml(dataParse.username)
            userController.signIn(
              dataParse,
              request.headers.api_key,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
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
    case '/users':
      if (request.method === 'GET') {
        userController.getAllUsers(request.headers)
      } else {
        response.end(
          JSON.stringify({ status: 405, message: 'Method not allowed' }),
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
          const dataParse = JSON.parse(taskData)
          if (dataParse.task_title !== undefined
            && validateNumber(dataParse.project_id)
            && validateNumber(dataParse.user_id)) {
            dataParse.task_title = escapeHtml(dataParse.task_title)
            taskController.handleCreateTask(
              dataParse,
              request.headers,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
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
          const dataParse = JSON.parse(taskData)
          if (dataParse.task_title !== undefined
            && validateNumber(dataParse.project_id)
            && validateNumber(dataParse.task_id)
            && validateNumber(dataParse.user_id)
            && validateNumber(dataParse.status_id)
          ) {
            dataParse.project_name = escapeHtml(dataParse.project_name)
            taskController.handleUpdateTask(
              dataParse,
              request.headers,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
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
        const keyword = escapeHtml(url.searchParams.get('key'))
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
        taskController.handleCountTasks(request.headers, { username, projectId, statusId })
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
          const dataParse = JSON.parse(projectData)
          if (dataParse.project_name !== undefined) {
            dataParse.project_name = escapeHtml(dataParse.project_name)
            projectController.handleCreateProject(
              dataParse,
              request.headers,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
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
        if (validateNumber(projectId)) {
          projectController.handleDeleteProject(request.headers, projectId)
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
    case '/projects/update':
      if (request.method === 'POST') {
        let projectData = ''
        request.on('data', (data) => {
          projectData += data
        })
        request.on('end', () => {
          const dataParse = JSON.parse(projectData)
          if (dataParse.project_name !== undefined && validateNumber(dataParse.project_id)) {
            dataParse.project_name = escapeHtml(dataParse.project_name)
            projectController.handleUpdateProject(
              projectData,
              request.headers,
            )
          } else {
            response.end(
              JSON.stringify({ status: 422, message: 'Unprocessable Entity' }),
            )
          }
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
