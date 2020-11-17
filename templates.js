module.exports.getMessage = (data) => {
  const messageArr = [
    `rawr! notices your bulgy wolgy, *${data.positiveIncrease}* new cases, you're so big :O \n` +
    `rubbies ;) *${data.deathIncrease}* deaths, it doesn't stop gwowing \n` +
    `your icu is at *${data.icuPercentage}%* capacity alweady mmmm~ \n` +
    `things awe wooking pwetty fuckywucky~ come back tommowo squirms pwetty pwease`,

    `Nyaah! Fwends are still dyiiiing *${data.deathIncrease}* (＾ワ＾)` +
    `*${data.positiveIncrease}* new cases means DOOOMMMM!!!` +
    `Hehe ^_^ *${data.icuPercentage}* capacity in your icu, so random!` +
    `newayz toodles!!!!`

  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]

}
