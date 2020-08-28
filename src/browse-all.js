const got = require("got")
const chalk = require("chalk")
const fs = require("fs")

// Categories that produce very heavy JSON files
const heavyCategories = async category => {
  const categories = {
    composers: "browse-all-composers.json",
    conductors: "browse-all-conductors.json",
    ensembles: "browse-all-ensembles.json",
    soloists: "browse-all-soloists.json"
  }

  return {
    results: JSON.parse(
      (await got.get(`https://api.idagio.com/v2.0/metadata/${category}`)).body
    ),
    fileName: categories[category]
  }
}

// Categories that produce small JSON files
const softCategories = async category => {
  const categories = {
    epochs: "browse-all-epochs.json",
    genres: "browse-all-genres.json",
    instruments: "browse-all-instruments.json"
  }

  const res = (await got.get("https://app.idagio.com/browse")).body
  const data = JSON.parse(
    res
      .split("window.__data__ = ")[1]
      .split("window.__sentry_dsn__")[0]
      .split(";")[0]
  )

  return {
    results: data.entities[category],
    fileName: categories[category]
  }
}

const saveResults = ({ results, fileName }) => {
  fs.writeFileSync(`out/${fileName}`, JSON.stringify(results, null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

const main = async () => {
  saveResults(await softCategories("instruments"))
  saveResults(await heavyCategories("composers"))
}

main().catch(err => {
  console.log(err)
})
