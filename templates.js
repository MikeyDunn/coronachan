module.exports.getTexasMessage = (data) => {
  const messageArr = [
    `rawr! Texas San !!! notices your bulgy wolgy, *${data.positiveIncrease}* new cases, you're so big :O \n` +
    `rubbies ;) *${data.deathIncrease}* deaths, it doesn't stop gwowing \n` +
    `your icu is at *${data.icuPercentage}%* capacity alweady mmmm~ \n` +
    `things awe wooking pwetty fuckywucky~ come back tommowo squirms pwetty pwease`,

    `Nyaah! Texas San!!! Yur Fwends are still dyiiiing *${data.deathIncrease}* (＾ワ＾)` +
    `*${data.positiveIncrease}* new cases means DOOOMMMM!!!` +
    `Hehe ^_^ *${data.icuPercentage}* capacity in your icu, so random!` +
    `newayz toodles!!!!`

  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]

}

module.exports.getOntarioMessage = (data2,data1) => {
	console.log(data1.fields[5].id)
  const positiveIncrease = (data2.records[0][data2.fields[5].id]-data1.records[0][data1.fields[5].id])
	console.log(positiveIncrease)
	console.log(data1.fields[7].id)
  const deathIncrease =  (data2.records[0][data2.fields[7].id]-data1.records[0][data1.fields[7].id])
	console.log(deathIncrease)
	console.log(data1.fields[14].id)
  const icuIncrease =  (data2.records[0][data2.fields[14].id]-data1.records[0][data1.fields[14].id])
	console.log(icuIncrease)
  

  const messageArr = [
    `rawr! I hawent fowgot abouout you Ontario Sama !!! notices your bulgy wolgy, *${positiveIncrease}* new cases, you're so big :O \n` +
    `rubbies ;) *${deathIncrease}* deaths, it doesn't stop gwowing \n` +
    `your icu increased by *${icuIncrease}* :ew alweady mmmm~ \n` +
    `things awe wooking pwetty fuckywucky~ come back tommowo squirms pwetty pwease`,

    `Nyaah! I hawent fowgot abouout you Ontario Kun!!! Yur Fwends are still dyiiiing *${deathIncrease}* (＾ワ＾)` +
    `*${positiveIncrease}* new cases means DOOOMMMM!!!` +
    `Hehe ^_^ *${icuIncrease}* increase in your icu, so random!` +
    `newayz toodles!!!!`

  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]

}
