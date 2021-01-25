const Discord = require('discord.js');
const TOKEN = 'ODAxMzE5NDc1MjUyODIyMDE2.YAe86g.5nGtjkhT9dmU4uGQTda57QgtKiQ';
const TEST_WEBHOOK = 'https://discord.com/api/webhooks/801324891391524874/s4lB8ViZ95MU3YztzvIuOIykfzIqYxJACdebrG6lU06WFPzFcZEfARrHxBlFsVlkej4W'
const WEBHOOK = 'https://discord.com/api/webhooks/801330364571713578/Cv_wx2l5MZHyJ99ZXfzM8ZIeLZxV-wuLg6_0lH9VsKU-lBaZbn1zrYYz-saQURrZ4aWs'
const axios = require('axios');
const moment = require('moment');
const { getConfig, saveConfig, isMenuExist, deleteConfig } = require('./files')
const scheduler = require('node-schedule');
const BOB_API_NAME = '밥API'



const menuArr = [
    "수제비",
    "05",
    "라김",
    "전라도",
    "육칼",
    "돈까스",
    "밥장인",
    "짱개",
    "햄버거",
    "담미온",
    "여수",
    "구내식당",
    "갈비탕"
];


const configureBobBot = () => {

    const client = new Discord.Client();
    
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
        if (msg.content === '$메뉴검색') {
            msg.reply(menuArr);
        }
    });

    client.login(TOKEN); //BUILD-A-BOT 생성 후 발급된 토큰(Token) 

}

const getRandomValue = () => menuArr[Math.floor(Math.random() * menuArr.length)]

const randomMenu = async () => {
    if (!isWeekend()) {
        const newMenuConfig = await getNotDuplicateValue()
        const date = getToday()
        const result = await sendMessage('day', newMenuConfig)
        if (result) await saveConfig({ date: date, menu: newMenuConfig.newMenu })
    } else {
        if (isSunday()) {
            const configArr = await getConfig()
            await sendMessage('week', configArr)
            await deleteConfig()
        }
    }
}

const isWeekend = () => {
    const currentDay = new Date().getDay()
    const isWeekend = (currentDay === 6 || currentDay === 0)
    console.log(`오늘은 일주일중 : ${currentDay} isWeekend ${isWeekend}`)
    return isWeekend
}

const isSunday = () => new Date().getDay() === 6

const getToday = () => moment().format("MM-DD")

const getNotDuplicateValue = async () => {

    let newMenu = getRandomValue()
    const menuConfigArr = await getConfig()
    let previousMenu = '전에 먹은 메뉴 없음'

    if (menuConfigArr && menuConfigArr.length > 0) {
        while (true) {
            if (isMenuExist(menuConfigArr, newMenu)) newMenu = getRandomValue()
            else break;
        }
        previousMenu = menuConfigArr[menuConfigArr.length - 1].menu || '메뉴 없음'
    }
    console.log(`previousMenu : ${previousMenu} newMenu : ${newMenu}`)
    return { newMenu: newMenu, previousMenu: previousMenu }
}


const sendMessage = async (type, newMenuConfig) => {

    const content = type === 'week' ? `주간 보고 : ${JSON.stringify(newMenuConfig)}`
        : `지난번 먹은 메뉴 : ${newMenuConfig.previousMenu} || 오늘의 랜덤 메뉴: ${newMenuConfig.newMenu}`

    const params = {
        username: BOB_API_NAME,
        avatar_url: "",
        content: content
    }

    return await axios.post(TEST_WEBHOOK, params)
        .then(true)
        .catch(e => {
            console.error(`sendMessage error : ${e}`)
            return false
        })
}

configureBobBot()
scheduler.scheduleJob("*/1 * * * *", randomMenu)

