# Task Management (Back-end)

A pure Node.js MVC Back-end to create RESTful APIs for Task Management Project.
## Tech Stack
- Node.js
- MySQL2
- Bcrypt
- Heroku

## Installation
If you're running it locally on your pc, also perform these steps:
- Create a mysql database using the schema in: **config/task-management.sql**

- Create **env.js** file  with the following contents (since this was excluded from being sent to github in the .gitignore file).

```bash
module.exports = {
  DB_CONFIG: {
    host: 'localhost', //Host name for connecting to MySQL database
    user: 'root', //User for connecting to MySQL database
    password: '', //Password for connecting to MySQL database
    database: 'task-management', //Name of the mysql database
  },
  PORT: 2000, //Port to host application on
}
```
  
- Use the [yarn](https://yarnpkg.com/) to install dependencies.

```bash
yarn
```

## Usage
Command to start the project

```python
yarn start
```

## Contributers

Project of _*Web technologies and e-Services (IT4409)*_

_**Created December, 2020**_ By:

- [Nguyen Duc Binh](https://github.com/tthandb)
- [Le Quang Huy](https://github.com/lqhuyhust)
- [Mac Quang Huy](https://github.com/16HuyOnTheMic)
- [Le Thi Huyen Thanh](https://github.com/thanhlth)
