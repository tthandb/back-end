module.exports = {
  validateNumber: (number) => new RegExp('^[0-9]+$').test(number),
  validateUsername: (username) => new RegExp('[^a-zA-Z0-9.-]').test(username),
}
