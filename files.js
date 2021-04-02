const fs = require('fs');
const defaultPath = './time_config.json';
const {getToday} = require('./utils');

const saveConfig = async (config) => {

    const previousConfigArr = await getConfig()

    const date = config.date
    const menu = config.menu

    if (!isMenuExist(previousConfigArr , menu)) previousConfigArr.push({ date: date, menu: menu })

    return new Promise(res => {
        fs.writeFile(defaultPath, JSON.stringify(previousConfigArr), e => {
            if (e) {
                throw new Error()
            }
            console.log('파일 저장 성공')
            res()
        })
    })
}

const deleteConfig  = async ()=> {
    try {
        if(await isFileExist()){
            fs.unlinkSync(defaultPath)
            console.log('주말 파일 삭제 완료')
        }
      } catch(err) {
        console.error(`deleteConfig err: ${err}`)
      }
}

const deleteTodayConfig  = async ()=> {
    try {
        if(await isFileExist()){
            const previousConfigArr = await getConfig()
            const today = getToday()
            const updateConfigArr = previousConfigArr.filter(({date})=>date != today);

            return new Promise(res => {
                fs.writeFile(defaultPath, JSON.stringify(updateConfigArr), e => {
                    if (e) {
                        throw new Error()
                    }
                    console.log('파일 저장 성공')
                    res()
                })
            })

        }
      } catch(err) {
        console.error(`deleteTodayConfig err: ${err}`)
      }
}

const isMenuExist = (arr, newMenu)=> arr.find(({menu})=>menu === newMenu)

async function isFileExist() {
    return new Promise((res, rej) => {
        fs.stat(defaultPath, e => {
            if (e) return res(false)
            res(true)
        })
    })
}

const getConfig = async () => {

    try {
        const fileExist = await isFileExist()

        if (fileExist) {
            const json = fs.readFileSync(defaultPath, 'utf-8')
            if (json) return JSON.parse(json)
            return []
        }
        return []
    } catch (e) {
        console.error(e)
        return []
    }
}

module.exports = {
    isMenuExist: isMenuExist,
    getConfig:getConfig,
    saveConfig:saveConfig,
    deleteConfig:deleteConfig,
    deleteTodayConfig:deleteTodayConfig
}
