module.exports = {
  validateNumber: (number) => new RegExp('^[0-9]+$').test(number),
  validateUsername: (username) => username !== undefined && username !== null && new RegExp('^[a-zA-Z0-9.-]+').test(username),
  escapeHtml: (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  },
  decodeURI: (uri) => decodeURIComponent(uri),
}
