// constants
const SLACK_WEBHOOK_PATH = process.env.SLACK_WEBHOOK_PATH

// services
const https = require('https')
const templates = require('./templates')

module.exports.handler = async event => {
  const covidTrackingPromise = getTexasCovidTracking()
  const healthDataPromise = getTexasHealthData()
  const [covidTrackingData, healthData] = await Promise.all([covidTrackingPromise, healthDataPromise])
  const message = templates.getMessage({ ...covidTrackingData, ...healthData })

  await postToSlack(message)
}

function getTexasCovidTracking() {
  return new Promise(resolve => {
    const date = new Date()

    date.setDate(date.getDate() - 1)

    const urlDate = date.toISOString().split('T')[0].replace(/-/g, '')
    const url = `https://api.covidtracking.com/v1/states/tx/${urlDate}.json`

    https.get(url, resp => {
      let data = ''

      resp.on('data', chunk => data += chunk)
      resp.on('end', () => resolve(JSON.parse(data)))
    })
  })
}

function getTexasHealthData() {
  return new Promise(resolve => {
    https.get('https://healthdata.gov/dataset/covid-19-estimated-patient-impact-and-hospital-capacity-state/resource/82e733c6-7baa-4c65', htmlResp => {
      let htmlData = ''

      htmlResp.on('data', chunk => htmlData += chunk)
      htmlResp.on('end', () => {
        const htmlSplit = htmlData.split('<div class="download"><a href="')[1]
        const csvUrl = htmlSplit.split('" type="text/csv;')[0]

        https.get(csvUrl, csvResp => {
          let csvData = ''

          csvResp.on('data', chunk => csvData += chunk)
          csvResp.on('end', () => {
            const csvSplit = csvData.split('TX,')
            const lastSplit = csvSplit[csvSplit.length - 1]
            const newestTxRecord = lastSplit.split(/\n/)[0]
            const icuPercentage = newestTxRecord.split(/(?!\B"[^"]*),(?![^"]*"\B)/)[4]

            resolve({ icuPercentage })
          })
        })
      })
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