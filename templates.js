module.exports.getMessage = (data) => {
  const messageArr = [
    `rawr! notices your bulgy wolgy, *${data.positiveIncrease}* new cases, you're so big :O \n` +
    `rubbies ;) *${data.deathIncrease}* deaths, it doesn't stop gwowing \n` +
    `your icu is at *${data.icuPercentage}%* capacity alweady mmmm~ \n` +
    `things awe wooking pwetty fuckywucky~ come back tommowo squirms pwetty pwease`
  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]

}
