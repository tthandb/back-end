'use strict';
let db = require('../config/database.js');

module.exports = {
  createProject: (project, callback) => {
    console.log(project);
    db.query('insert into projects set ?', project, (error, result) => {
      if (!error) {
        let data = {
          project_id: result.insertId,
          project_name: project.project_name,
        };
        callback(0, data);
      } else callback(error);
    });
  },
  deleteProject: (projectId, callback) => {
    module.exports.projectAuth(projectId, (err, result) => {
      if (err) callback(err);
      else if (result === true) {
        db.query(
          'delete from projects where project_id = ?',
          [projectId],
          (error) => {
            if (!error) callback(0, true);
            else callback(error);
          }
        );
      } else callback(0, false);
    });
  },
  viewProject: (projectId, callback) => {
    module.exports.checkProjectExist(projectId, (err, result) => {
      if (err) {
        callback(err);
      } else {
        if (result === true) {
          db.query(
            'select * from projects where project_id = ?',
            [projectId],
            (error, result) => {
              if (!error) {
                callback(0, result);
              } else callback(error);
            }
          );
        } else {
          callback(0, false);
        }
      }
    });
  },
  viewAllProjects: (callback) => {
    db.query('select * from projects', (error, result) => {
      if (!error) {
        callback(0, result);
      } else callback(error);
    });
  },
  updateProject: (project, callback) => {
    module.exports.projectAuth(project.project_id, (err, result) => {
      if (err) {
        callback(error);
      } else {
        if (result === true) {
          db.query(
            'update projects set ? where project_id = ?',
            [
              {
                project_name: project.project_name,
              },
              project.project_id,
            ],
            (error, result) => {
              if (!error) {
                callback(0, result);
              } else callback(error);
            }
          );
        } else {
          callback(0, false);
        }
      }
    });
  },
  projectAuth: (project_id, callback) => {
    db.query(
      'select count(*) as project_count from projects where project_id = ?',
      [project_id],
      (error, rows) => {
        if (!error) {
          if (rows[0].project_count) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
  checkProjectExist: (project_id, callback) => {
    db.query(
      'select count(*) as project_count from projects where project_id = ?',
      [project_id],
      (error, rows) => {
        if (!error) {
          if (rows[0].project_count) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
};
