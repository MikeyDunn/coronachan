module.exports.getComparisonMessage = (texasData, ontarioData) => {
  const texasCasesTotal = texasData.positive
  const ontarioCasesTotal = ontarioData.records[ontarioData.records.length - 1][ontarioData.fields[8].id]
  const texasPopulation = 29000000
  const ontarioPopulation = 14570000
  const texasCasePercentage = (texasCasesTotal / texasPopulation) * 100
  const ontarioCasePercentage = (ontarioCasesTotal / ontarioPopulation) * 100
  const messageArr = [
    `Konichiwaaaa Texas!! *${texasCasePercentage.toFixed(2)}%* of your pawpuwation caught the coof so far \n` +
    `*${ontarioCasePercentage.toFixed(2)}%* of Ontawio too~~ OwO \n` +
    `Good luck todaay!`
  ]

  return messageArr[Math.floor(Math.random() * messageArr.length)]
}

