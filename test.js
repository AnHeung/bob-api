const Discord = require('discord.js');
const TOKEN = 'ODAxMzE5NDc1MjUyODIyMDE2.YAe86g.5nGtjkhT9dmU4uGQTda57QgtKiQ';
const TEST_WEBHOOK = 'https://discord.com/api/webhooks/801324891391524874/s4lB8ViZ95MU3YztzvIuOIykfzIqYxJACdebrG6lU06WFPzFcZEfARrHxBlFsVlkej4W'
const WEBHOOK = 'https://discord.com/api/webhooks/801330364571713578/Cv_wx2l5MZHyJ99ZXfzM8ZIeLZxV-wuLg6_0lH9VsKU-lBaZbn1zrYYz-saQURrZ4aWs'
const axios = require('axios');
const moment = require('moment');
const {getConfig , saveConfig} = require('./files')
const scheduler = require('node-schedule');
const BOB_API_NAME = '밥API'


const test = [
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

const getRandomValue = ()=>test[Math.floor(Math.random() * test.length)]

const randomMenu = async () => {
    if (!isWeekend()) {
        const newMenuConfig = await getNotDuplicateValue()
        const date = getToday()
        const result = await sendMessage(newMenuConfig)
        if (result) await saveConfig({ date: date, menu: newMenuConfig.newMenu })
    }
}

const isWeekend = () => {
    const currentDay = new Date().getDay()
    const isWeekend = (currentDay === 6 || currentDay === 7)
    console.log(`오늘은 일주일중 : ${currentDay} isWeekend ${isWeekend}`)
}

const getToday = () => moment().format("MM-DD")

const getNotDuplicateValue = async () => {
    let newMenu = getRandomValue()
    const menuConfig = await getConfig()
    let previousMenu = getRandomValue()
    if(menuConfig){
        previousMenu = menuConfig.menu
        while(true){
            if(previousMenu && previousMenu === newMenu)newMenu = getRandomValue()
            else break;
        }
    }
    return {newMenu:newMenu , previousMenu:previousMenu}
}


const sendMessage = async (newMenuConfig) => {

    const params = {
        username: BOB_API_NAME,
        avatar_url: "",
        content: `지난번 먹은 메뉴 : ${newMenuConfig.previousMenu} || 오늘의 랜덤 메뉴: ${newMenuConfig.newMenu}`
    }

    return await axios.post(TEST_WEBHOOK, params)
        .then(true)
        .catch(e => {
            console.error(`sendMessage error : ${e}`)
            return false
        })
}

scheduler.scheduleJob("00 12* * *", randomMenu)

