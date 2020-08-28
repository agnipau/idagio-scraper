const got = require("got")
const fs = require("fs")
const cheerio = require("cheerio")
const chalk = require("chalk")

const main = async () => {
  const fileName = "moods.json"
  const res = (await got.get("https://app.idagio.com/moods")).body
  const $ = cheerio.load(res)

  const moods = Array.from(
    $("#root > div > section > div > ul > li:nth-child(n+1) > a")
  ).map(x => {
    const id = $(x)
      .attr("href")
      .replace("/moods/", "")
    return {
      name: $("span", x).text(),
      id: id,
      url: `https://app.idagio.com/moods/${id}`
    }
  })

  const results = (await Promise.all(
    moods.map(x => got.get(`https://api.idagio.com/v2.0/playlists/${x.id}`))
  )).map(x => JSON.parse(x.body))

  fs.writeFileSync(`out/${fileName}`, JSON.stringify(results, null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

main().catch(err => {
  console.log(err)
})
