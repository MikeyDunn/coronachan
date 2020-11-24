module.exports.getTexasMessage = (data) => {
  const messageArr = [
    `rawr! Texas San !!! notices your bulgy wolgy, *${data.positiveIncrease}* new cases, you're so big :O \n` +
    `rubbies ;) *${data.deathIncrease}* deaths, it doesn't stop gwowing \n` +
    `your icu is at *${data.icuPercentage}%* capacity alweady mmmm~ \n` +
    `things awe wooking pwetty fuckywucky~ come back tommowo squirms pwetty pwease`,

    `Nyaah! Texas San!!! Yur Fwends are still dyiiiing *${data.deathIncrease}* (＾ワ＾) \n` +
    `*${data.positiveIncrease}* new cases means DOOOMMMM!!! \n` +
    `Hehe ^_^ *${data.icuPercentage}* capacity in your icu, so random! \n` +
    `newayz toodles!!!!`
  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]
}

module.exports.getOntarioMessage = (newData, previousData) => {
  const positiveIncrease = (newData.records[0][newData.fields[8].id] - previousData.records[0][previousData.fields[8].id])
  const deathIncrease = (newData.records[0][newData.fields[7].id] - previousData.records[0][previousData.fields[7].id])
  const icuIncrease = (newData.records[0][newData.fields[14].id] - previousData.records[0][previousData.fields[14].id])

  const messageArr = [
    `I hawent fowgot abouout you Ontawio Sama!!! \n` +
    `*${positiveIncrease}* new kawaises *${deathIncrease}* deaths and *${icuIncrease}* more in icu is giving me double duty :O \n` +
    `but i can handle it~~`,

    `Ontawio Sama ^w^  I have you nyew statistics tuou ｡◕ ‿ ◕｡. I'm twacking *${positiveIncrease}* nyew confiwmed kwaises \n` +
    `*${deathIncrease}* deaths (◠﹏◠✿), *${icuIncrease}* additions to the icu`
  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]
}

module.exports.getComparisonMessage = (texasData, ontarioData, texasPopulationData, ontarioPopulationData) => {
  const texasCasesTotal = texasData.positive
  const ontarioCasesTotal = ontarioData.records[0][ontarioData.fields[8].id]
  const texasDeathTotal = texasData.death
  const ontarioDeathTotal = ontarioData.records[0][ontarioData.fields[7].id]
  
  let texasPopulation = 29000000
  if (typeof(texasPopulationData.queryresult.pods) !== 'undefined') {
     texasPopulation =  parseInt(texasPopulationData.queryresult.pods[1].subpods[0].plaintext.split(" ")[0],10) * 1000000
  }
  let ontarioPopulation = 14570000
  if (typeof(ontarioPopulationData.queryresult.pods) !== 'undefined') {
      ontarioPopulation = parseInt(ontarioPopulationData.queryresult.pods[1].subpods[0].plaintext.split(" ")[0],10) * 1000000 
  }

  const texasCasePercentage = (texasCasesTotal/texasPopulation) * 100
  const ontarioCasePercentage = (ontarioCasesTotal/ontarioPopulation) * 100
  const texasDeathPercentage = (texasDeathTotal/texasPopulation) * 100
  const ontarioDeathPercentage = (ontarioDeathTotal/ontarioPopulation) * 100
  const messageArr = [
	  `Oh wow Texas San *${texasCasePercentage.toFixed(5)}%* of youw popuwation cases so much mowe then Ontawio Sama *${ontarioCasePercentage.toFixed(5)}%* youw so big. 
and *${texasDeathPercentage.toFixed(5)}%* of texas sans popuwation has died oh nyo but ontawio sama is catching up with *${ontarioDeathPercentage.toFixed(5)}%*.`
  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]
}

