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
  deleteProject: (project_id, callback) => {
    module.exports.projectAuth(project_id, (err, result) => {
      if (err) callback(err);
      else if (result === true) {
        db.query(
          'delete from projects where project_id = ?',
          [project_id],
          (error) => {
            if (!error) callback(0, true);
            else callback(error);
          }
        );
      } else callback(0, false);
    });
  },
  viewProject: (project_id, callback) => {
    module.exports.checkProjectExist(project_id, (err, result) => {
      if (err) {
        callback(err);
      } else {
        if (result === true) {
          db.query(
            'select * from projects where project_id = ?',
            [project_id],
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
  searchproduct: function (search_query, offset, callback) {
    db.query(
      'select product_name, product_desc,product_url,product_price,date_added from products where product_name like ' +
        db.escape('%' + search_query + '%') +
        'limit 1 offset ' +
        offset,
      function (error, result) {
        if (!error) {
          callback(0, result);
        } else console.log(error);
      }
    );
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
  checkProjectExist: function (project_id, callback) {
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
