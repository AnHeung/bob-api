const moment = require('moment');

const isSunday = () => new Date().getDay() === 0

const getToday = () => moment().format("MM-DD")

const isWeekend = () => {
    const currentDay = new Date().getDay()
    const isWeekend = (currentDay === 6 || currentDay === 0)
    console.log(`오늘은 일주일중 : ${currentDay} isWeekend ${isWeekend}`)
    return isWeekend
}

module.exports = {
    isSunday : isSunday , 
    getToday:getToday,
    isWeekend:isWeekend
}