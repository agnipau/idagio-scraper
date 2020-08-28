const got = require("got")
const fs = require("fs")
const chalk = require("chalk")

const main = async () => {
  const fileName = "bulk.json"

  // Some example tracks
  const payload = {
    ids: [
      "11029023",
      "11471694",
      "11152354",
      "8017589",
      "11087373",
      "11054784",
      "7573892",
      "13359972",
      "11123997",
      "5895793",
      "1531225",
      "11071489",
      "12086902",
      "3318265",
      "11388458",
      "7115632",
      "11085447",
      "128983",
      "11123302",
      "11099085",
      "1525411",
      "11162237",
      "9197131",
      "11116276",
      "11050777",
      "11085048",
      "163468",
      "347400",
      "11410024",
      "122832",
      "10891723",
      "11046737",
      "2549979",
      "143400",
      "4364871",
      "4254825",
      "367632",
      "11099188",
      "11423861",
      "154030",
      "11050224",
      "10569929",
      "11039606",
      "1695472",
      "11519263",
      "1465154",
      "11645663",
      "13059719",
      "11378495",
      "11044882"
    ]
  }

  const res = JSON.parse(
    (await got.post("https://api.idagio.com/v2.0/metadata/tracks/bulk", {
      body: JSON.stringify(payload)
    })).body
  )
  fs.writeFileSync(`out/${fileName}`, JSON.stringify(res, null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

main().catch(err => {
  console.log(err)
})
