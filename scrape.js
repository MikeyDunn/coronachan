// constants
const SLACK_WEBHOOK_PATH = process.env.SLACK_WEBHOOK_PATH

// services
const https = require('https')
const templates = require('./templates')

module.exports.handler = async event => {
  const covidOntarioTodayTrackingPromise = getOntarioCovidTracking(0)
  const covidOntarioYesterdayTrackingPromise = getOntarioCovidTracking(1)
  const covidTrackingPromise = getTexasCovidTracking()
  const healthDataPromise = getTexasHealthData()
  const [covidTrackingData, healthData, ontarioTData, ontarioYData] = await Promise.all([covidTrackingPromise, healthDataPromise, covidOntarioTodayTrackingPromise, covidOntarioYesterdayTrackingPromise])
  const texasMessage = templates.getTexasMessage({ ...covidTrackingData, ...healthData })
// console.log(texasMessage)
	const ontarioMessage = templates.getOntarioMessage(ontarioTData.result, ontarioYData.result)
//	console.log(ontarioMessage)
  await postToSlack(texasMessage)
  await postToSlack(ontarioMessage)
}

function getOntarioCovidTracking(lookback) {
  return new Promise(resolve => {
const date = new Date()

	  if (lookback > 0) {
    date.setDate(date.getDate() - lookback)
	  }
    const urlDate = date.toISOString().replace(/T.*Z/, "T00:00:00")
    const url = `https://data.ontario.ca/api/3/action/datastore_search?q=${urlDate}&resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11`
  https.get(url, resp => {
      let data = ''
      resp.on('data', chunk => data += chunk)
      resp.on('end', () => resolve(JSON.parse(data)))
    }).on('error', (e) => {
  console.error(e);
})
  })
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
    const url = 'https://healthdata.gov/dataset/covid-19-estimated-patient-impact-and-hospital-capacity-state/resource/82e733c6-7baa-4c65'

    https.get(url, htmlResp => {
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
