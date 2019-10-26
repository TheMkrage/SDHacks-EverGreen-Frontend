var API = "http://localhost:5000"

export function getPound(code, requests_per_day) {
  var body = {
    code: code,
    requests_per_day: requests_per_day
  }
  return fetch(API + "/pounds", {
    method: 'POST',
    body: JSON.stringify(body)
  })
}
