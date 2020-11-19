"use strict";
let db = require("../config/database.js");

module.exports = {
  createproduct: function (product, callback) {
    let generatedproducturl = module.exports.generate_product_url(
      product.product_name
    );
    product.product_url = generatedproducturl;
    db.query("insert into tasks set ?", product, function (error, result) {
      if (!error) {
        let data = {
          task_id: result.insertid,
          task_name: product.product_name,
        };
        callback(0, data);
      } else callback(error);
    });
  },
  deleteproduct: function (user_id, product_id, callback) {
    //check for valid user of this product
    module.exports.product_auth(user_id, product_id, function (err, result) {
      if (err) {
        callback(error);
      } else {
        //if valid delete from database
        if (result === true) {
          db.query("delete from products where id = ?", [product_id], function (
            error,
            result
          ) {
            if (!error) {
              //callback
              callback(0, true);
            } else callback(error);
          });
        } else {
          callback(0, false);
        }
      }
    });
  },
  delistproduct: function (user_id, product_id, callback) {
    //check if product exists or not call self module function using module.exports
    module.exports.check_product_exists(product_id, function (err, result) {
      if (err) {
        callback(err);
      } else {
        //if yes then set disable by setting active field false
        if (result === true) {
          db.query(
            "update products set ? where id = ?",
            [{ active: 0 }, product_id],
            function (error, result) {
              if (!error) {
                callback(0, true);
              } else console.log(error);
              callback(error);
            }
          );
        } else {
          callback(0, false);
        }
      }
    });
  },
  viewsingleproduct: function (product_id, callback) {
    module.exports.check_product_exists(product_id, function (err, result) {
      if (err) {
        callback(error);
      } else {
        if (result === true) {
          db.query(
            "select * from products where id = ? and active = 1",
            [product_id],
            function (error, result) {
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
      "select product_name, product_desc,product_url,product_price,date_added from products where product_name like " +
        db.escape("%" + search_query + "%") +
        "limit 1 offset " +
        offset,
      function (error, result) {
        if (!error) {
          callback(0, result);
        } else console.log(error);
      }
    );
  },
  updateproduct: function (product, callback) {
    module.exports.product_auth(product.user_id, product.product_id, function (
      err,
      result
    ) {
      if (err) {
        callback(error);
      } else {
        if (result === true) {
          db.query(
            "update products set ? where id = ?",
            [
              {
                product_name: product.product_name,
                product_desc: product.product_desc,
                product_price: product.product_price,
              },
              product.product_id,
            ],
            function (error, result) {
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
  generate_product_url: function (product_name) {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz@#$&";
    let result = "";
    for (let i = 6; i > 0; --i)
      result += chars[math.floor(math.random() * chars.length)];
    return product_name + "-" + result;
  },
  product_auth: function (user_id, product_id, callback) {
    db.query(
      "select count(*) as productcount from products where id = ? and user_id = ? and active = 1",
      [product_id, user_id],
      function (error, rows) {
        if (!error) {
          if (rows[0].productcount) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
  check_product_exists: function (product_id, callback) {
    db.query(
      "select count(*) as productcount from products where id = ? and  active = 1 ",
      [product_id],
      function (error, rows) {
        if (!error) {
          if (rows[0].productcount) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
};
