import fs from 'fs'

const fileName = 'config.json'
const defaultConfig = {
  userName: 'user-1'
}
let config = JSON.parse(JSON.stringify(defaultConfig))

const getConfig = () => {
  return new Promise((resolve, reject) => {
    fs.open(fileName, 'r+', function (err) {
      if (err) {
        console.log(err)
        if (err.code === 'ENOENT') {
          console.log(`不存在${fileName}`)
          saveConfig(config)
            .then(() => {
              console.log(`生成${fileName}成功`)
              resolve(config)
            })
            .catch((err) => {
              reject(err)
            })
          return
        }

        reject(err)
      }

      console.log('文件打开成功！')
      fs.readFile(fileName, function (err, data) {
        if (err) {
          reject(err)
        }
        let str = data.toString()
        if (str) {
          try {
            config = JSON.parse(str)
          } catch (e) {
            console.error(e)
          }
        }
        resolve(config)
      })
    })
  })
}

const saveConfig = (newConfig) => {
  return new Promise((resolve, reject) => {
    if (!newConfig) {
      throw new Error('no config')
    }
    fs.writeFile(fileName, JSON.stringify(newConfig), (err) => {
      if (err) {
        reject(err)
      }
      console.log(`保存${fileName}成功`)
      config = JSON.parse(JSON.stringify(newConfig))
      resolve(newConfig)
    })
  })
}

export default {
  config,
  getConfig,
  saveConfig
}
