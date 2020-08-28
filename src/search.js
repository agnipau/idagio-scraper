const got = require("got")
const fs = require("fs")
const chalk = require("chalk")

const popularSearches = async () =>
  JSON.parse(
    (await got.get("https://api.idagio.com/v1.8/lucene/search/popular")).body
  )

const customSearches = async term =>
  JSON.parse(
    (await got.get(`https://api.idagio.com/v1.8/lucene/search/?term=${term}`))
      .body
  )

const searchCategory = async ({ category, term }) => {
  const categories = {
    popular: {
      results: await popularSearches(),
      fileName: "popular-searches.json"
    },
    custom: {
      results: await customSearches(term),
      fileName: "custom-search.json"
    }
  }

  return categories[category]
}

const saveResults = ({ results, fileName }) => {
  fs.writeFileSync(`out/${fileName}`, JSON.stringify(results, null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

const main = async () => {
  saveResults(await searchCategory({ category: "popular" }))
  saveResults(await searchCategory({ category: "custom", term: "wagner" }))
}

main().catch(err => {
  console.log(err)
})
