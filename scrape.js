// constants
const SLACK_WEBHOOK_PATH = process.env.SLACK_WEBHOOK_PATH

// services
const https = require('https')
const templates = require('./templates')

module.exports.handler = async () => {
  // request data
  const covidOntarioTodayTrackingPromise = getOntarioCovidTracking(0)
  const covidTrackingPromise = getTexasCovidTracking()
  const [covidTrackingData, ontarioTData] = await Promise.all([covidTrackingPromise, covidOntarioTodayTrackingPromise])

  // generate messaging
  const raceToTheBottomMessage = templates.getComparisonMessage(covidTrackingData, ontarioTData.result)

  // post to slack
  await postToSlack(raceToTheBottomMessage)
}

function getOntarioCovidTracking(daysToLookBack = 0) {
  return new Promise(resolve => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset - daysToLookBack * 86400000))
    const urlDate = localISOTime.toISOString().replace(/T.*Z/, "T00:00:00")
    const url = `https://data.ontario.ca/api/3/action/datastore_search?q=${urlDate}&resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11`

    https.get(url, resp => {
      let data = ''

      resp.on('data', chunk => data += chunk)
      resp.on('end', () => resolve(JSON.parse(data)))
    })
  })
}

function getTexasCovidTracking() {
  return new Promise(resolve => {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset))

    const urlDate = localISOTime.toISOString().split('T')[0].replace(/-/g, '')
    const url = `https://api.covidtracking.com/v1/states/tx/${urlDate}.json`

    https.get(url, resp => {
      let data = ''

      resp.on('data', chunk => data += chunk)
      resp.on('end', () => resolve(JSON.parse(data)))
    })
  })
}

function postToSlack(message) {
  return new Promise(resolve => {
    const data = JSON.stringify({ text: message })
    const options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: SLACK_WEBHOOK_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const req = https.request(options, res => { res.on('data', resolve) })

    req.write(data)
    req.end()
  })
}
