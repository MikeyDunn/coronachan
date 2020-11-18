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
  const positiveIncrease = (newData.records[0][newData.fields[5].id] - previousData.records[0][previousData.fields[5].id])
  const deathIncrease = (newData.records[0][newData.fields[7].id] - previousData.records[0][previousData.fields[7].id])
  const icuIncrease = (newData.records[0][newData.fields[14].id] - previousData.records[0][previousData.fields[14].id])

  const messageArr = [
    `I hawent fowgot abouout you Ontawio Sama!!! \n` +
    `*${positiveIncrease}* new kawaises *${deathIncrease}* deaths and *${icuIncrease}* more in icu is giving me double duty :O \n` +
    `but i can handle it~~`,

    `Ontawio Sama ^w^  I have you nyew statistics tuou ｡◕ ‿ ◕｡. I'm twacking *${positiveIncrease} nyew confiwmed kwaises \n` +
    `${deathIncrease} deaths (◠﹏◠✿), ${icuIncrease} additions to the icu`
  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]
}
