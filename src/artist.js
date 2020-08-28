const got = require("got")
const chalk = require("chalk")
const fs = require("fs")

const scrapeCategory = async ({ category, composerId }) => {
  const categories = {
    albums: {
      sortType: {
        copyrightYear: "&sort=copyrightYear"
      },
      fileName: "artist-albums.json",
      authorName: "artist"
    },
    works: {
      sortType: {
        alphabetical: "&sort=alphabetical",
        popular: "&sort=popular"
      },
      fileName: "artist-works.json",
      authorName: "composer"
    },
    recordings: {
      sortType: {
        popular: "&sort=popular",
        recent: "&sort=recent",
        chronological: "&sort=chronological"
      },
      fileName: "artist-recordings.json",
      authorName: "artist"
    }
  }

  const authorName = categories[category].authorName
  const fileName = categories[category].fileName
  const sortType = Object.values(categories[category].sortType)[0]

  const count = JSON.parse(
    (await got.get(
      `https://api.idagio.com/v2.0/metadata/${category}/filter?${authorName}=${composerId}${sortType}`
    )).body
  ).meta.count

  const results = []
  for (let i = 0, progress = 0, cursor = ""; i < count; i += 100) {
    const limit = count - i <= 100 ? count - i : 100
    progress += limit

    console.log(`${chalk.green("==>")} Progress: ${progress}`)
    const url = `https://api.idagio.com/v2.0/metadata/${category}/filter?${authorName}=${composerId}${sortType}&limit=${limit}${cursor}`
    console.log(`  ${chalk.cyan("->")} Url: ${url}`)
    const res = JSON.parse((await got.get(url)).body)

    results.push(res.results)
    cursor = `&cursor=${res.meta.cursor.next}`
  }

  return {
    results,
    fileName
  }
}

const saveResults = ({ results, fileName }) => {
  fs.writeFileSync(`out/${fileName}`, JSON.stringify(results.flat(), null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

const main = async () => {
  const obj = {
    category: "recordings",
    // Vivaldi
    // composerId: "62314"
    // Mozart
    composerId: "61251"
  }
  saveResults(await scrapeCategory(obj))
}

main().catch(err => {
  console.log(err)
})
