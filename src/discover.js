const got = require("got")
const fs = require("fs")
const chalk = require("chalk")

const main = async () => {
  const fileName = "discover.json"
  const res = JSON.parse(
    (await got.get("https://api.idagio.com/v2.1/discover/home")).body
  )
  fs.writeFileSync(`out/${fileName}`, JSON.stringify(res, null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

main().catch(err => {
  console.log(err)
})
