// constants
const SLACK_WEBHOOK_PATH = process.env.SLACK_WEBHOOK_PATH

// services
const https = require('https')
const templates = require('./templates')

module.exports.handler = async event => {
  // request data
  const covidOntarioTodayTrackingPromise = getOntarioCovidTracking(1)
  const covidOntarioYesterdayTrackingPromise = getOntarioCovidTracking(2)
  const covidTrackingPromise = getTexasCovidTracking()
  const healthDataPromise = getTexasHealthData()
  const wolfTexasPromise = askWolf("What is the Population of Texas?")
  const wolfOntarioPromise = askWolf("What is the Population of Ontario?")
  const [
    covidTrackingData,
    healthData,
    ontarioTData,
    ontarioYData,
    wolfTexasData,
    wolfOntarioData
  ] = await Promise.all([
    covidTrackingPromise,
    healthDataPromise,
    covidOntarioTodayTrackingPromise,
    covidOntarioYesterdayTrackingPromise,
    wolfTexasPromise,
    wolfOntarioPromise
  ])

  // generate messaging
  const texasMessage = templates.getTexasMessage({ ...covidTrackingData, ...healthData })
  const ontarioMessage = templates.getOntarioMessage(ontarioTData.result, ontarioYData.result)

   const raceToTheBottomMessage = templates.getComparisonMessage(covidTrackingData, ontarioTData.result, wolfTexasData, wolfOntarioData)
  // post to slack
 // await postToSlack(texasMessage)
 // await postToSlack(ontarioMessage)
 // await postToSlack(raceToTheBottomMessage)	
  console.log(raceToTheBottomMessage)
}

function getOntarioCovidTracking(daysToLookBack = 0) {
  return new Promise(resolve => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset - daysToLookBack*86400000))
    const urlDate = localISOTime.toISOString().replace(/T.*Z/, "T00:00:00")
    const url = `https://data.ontario.ca/api/3/action/datastore_search?q=${urlDate}&resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11`

    https.get(url, resp => {
      let data = ''

      resp.on('data', chunk => data += chunk)
      resp.on('end', () => resolve(JSON.parse(data)))
    })
  })
}

function askWolf(input) {
  return new Promise(resolve => {
    const wolfID =  ""

    input = input.replace(/\s/g,'+')
    const url = `https://api.wolframalpha.com/v2/query?input=${input}&format=moutput&format=plaintext&output=json&appid=${wolfID}`

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
    var localISOTime = (new Date(Date.now() - tzoffset - 86400000))

    const urlDate = localISOTime.toISOString().split('T')[0].replace(/-/g, '')
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
