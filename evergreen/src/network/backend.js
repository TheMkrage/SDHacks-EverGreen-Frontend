var API = "http://localhost:5000"

export function getPound(code, requests_per_day, inst_name) {
  var body = {
    code: code,
    requests_per_day: requests_per_day,
    inst_name: inst_name
  }
  return fetch(API + "/pounds", {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export function getMetric(pounds) {
  return fetch(API + "/metrics?pounds=" + pounds, {
    method: 'GET',
  })
}
