const fs = require('fs');
const defaultPath = './time_config.json';

exports.saveConfig = async (config) => {

    const date = config.date
    const menu = config.menu

    return new Promise(res => {
        fs.writeFile(defaultPath, JSON.stringify({ date: date, menu: menu }), e => {
            if (e) {
                throw new Error()
            }
            console.log('파일 저장 성공')
            res()
        })
    })
}

async function isFileExist() {
    return new Promise((res, rej) => {
        fs.stat(defaultPath, e => {
            if (e) return res(false)
            res(true)
        })
    })
}

exports.getConfig = async () => {

    try {
        const fileExist = await isFileExist()

        if (fileExist) {
            const json = fs.readFileSync(defaultPath, 'utf-8')
            if (json) return JSON.parse(json)
            return false
        }
        return false
    } catch (e) {
        console.error(e)
        return false
    }
}


