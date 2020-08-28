const got = require("got")
const chalk = require("chalk")
const fs = require("fs")
const cheerio = require("cheerio")

const recursiveTraverse = o =>
  Object.values(o).flatMap(x => (Array.isArray(x) ? x : recursiveTraverse(x)))

const scrapeComposers = async () => {
  const res = (await got.get("https://app.idagio.com/browse/composers")).body
  const $ = cheerio.load(res)

  return Array.from(
    $("#root > div > section > div > div > div > ul:nth-child(4) > a")
  ).map(x => {
    const id = $(x)
      .attr("href")
      .replace("/profiles/", "")
    return {
      name: $("span", x).text(),
      id: id,
      propicUrlFull: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format`,
      propicUrlDpr1: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=1&crop=faces&fit=crop&w=160&h=160`,
      propicUrlDpr2: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=2&crop=faces&fit=crop&w=160&h=160`,
      propicUrlDpr3: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=3&crop=faces&fit=crop&w=160&h=160`
    }
  })
}

const scrapePerformers = async () => {
  const res = (await got.get("https://app.idagio.com/browse/performers")).body
  const $ = cheerio.load(res)

  const performers = {
    conductors: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(3) > a"
      )
    ),
    soloists: {
      pianists: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(6) > li:nth-child(1) > ul > li:nth-child(n+1) > a"
        )
      ),
      violinists: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(6) > li:nth-child(2) > ul > li:nth-child(n+1) > a"
        )
      ),
      cellists: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(6) > li:nth-child(3) > ul > li:nth-child(n+1) > a"
        )
      ),
      vocalists: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(6) > li:nth-child(4) > ul > li:nth-child(n+1) > a"
        )
      )
    },
    ensembles: {
      orchestras: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(9) > li:nth-child(1) > ul > li:nth-child(n+1) > a"
        )
      ),
      choirs: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(9) > li:nth-child(2) > ul > li:nth-child(n+1) > a"
        )
      ),
      stringQuartets: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(9) > li:nth-child(3) > ul > li:nth-child(n+1) > a"
        )
      ),
      periodInstrumentEnsembles: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > ul:nth-child(9) > li:nth-child(4) > ul > li:nth-child(n+1) > a"
        )
      )
    }
  }

  return recursiveTraverse(performers).map(x => {
    const id = $(x)
      .attr("href")
      .replace("/profiles/", "")
    return {
      name: $("span", x).text(),
      id: id,
      propicUrlFull: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format`,
      propicUrlDpr1: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=1&crop=faces&fit=crop&w=160&h=160`,
      propicUrlDpr2: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=2&crop=faces&fit=crop&w=160&h=160`,
      propicUrlDpr3: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=3&crop=faces&fit=crop&w=160&h=160`
    }
  })
}

const scrapeEpochs = async () => {
  const res = (await got.get("https://app.idagio.com/browse/epochs")).body
  const $ = cheerio.load(res)

  const epochs = {
    contemporary: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(1) > ul > a"
      )
    ),
    twentyThCentury: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(2) > ul > a"
      )
    ),
    romantic: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(3) > ul > a"
      )
    ),
    classical: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(4) > ul > a"
      )
    ),
    baroque: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(5) > ul > a"
      )
    ),
    renaissance: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(6) > ul > a"
      )
    ),
    medieval: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(7) > ul > a"
      )
    )
  }

  return recursiveTraverse(epochs).map(x => {
    const id = $(x)
      .attr("href")
      .replace("/profiles/", "")
    return {
      name: $("span", x).text(),
      id: id,
      propicUrlFull: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format`,
      propicUrlDpr1: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=1&crop=faces&fit=crop&w=160&h=160`,
      propicUrlDpr2: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=2&crop=faces&fit=crop&w=160&h=160`,
      propicUrlDpr3: `https://idg-prod.imgix.net/artists/${id}/main.jpg?auto=format&dpr=3&crop=faces&fit=crop&w=160&h=160`
    }
  })
}

const scrapeGenres = async () => {
  const res = (await got.get("https://app.idagio.com/browse/genres")).body
  const $ = cheerio.load(res)

  const genres = {
    opera: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(1) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    },
    orchestral: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(2) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    },
    concertos: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(3) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    },
    chamber: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(4) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    },
    keyboard: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(5) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    },
    sacredVocal: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(6) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    },
    secularVocal: {
      description: $(
        "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(7) > div > p"
      ).text(),
      reccomended: Array.from(
        $(
          "#root > div > section > div > div > div > div:nth-child(2) > div:nth-child(7) > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
        )
      )
    }
  }

  return Object.values(genres).map(genre => {
    return {
      description: genre.description,
      reccomended: genre.reccomended.map(x => {
        const id = $(x)
          .attr("href")
          .replace("/works/", "")
        return {
          name: $(x).text(),
          id: id,
          url: `https://app.idagio.com/works/${id}`
        }
      })
    }
  })
}

const scrapeInstruments = async () => {
  const res = (await got.get("https://app.idagio.com/browse/instruments")).body
  const $ = cheerio.load(res)

  const instruments = {
    piano: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(2) > ul > li:nth-child(n+1) > div > a"
      )
    ),
    violin: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(3) > ul > li:nth-child(n+1) > div > a"
      )
    ),
    violoncello: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(4) > ul > li:nth-child(n+1) > div > a"
      )
    ),
    clarinet: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(5) > ul > li:nth-child(n+1) > div > a"
      )
    ),
    horn: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(6) > ul > li:nth-child(n+1) > div > a"
      )
    ),
    guitar: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(7) > ul > li:nth-child(n+1) > div > a"
      )
    ),
    electronics: Array.from(
      $(
        "#root > div > section > div > div > div > div:nth-child(8) > ul > li:nth-child(n+1) > div > a"
      )
    )
  }

  return Object.entries(instruments).map(([instrument, tracks]) => {
    return {
      instrument: instrument,
      tracks: tracks.map(x => {
        const id = $(x)
          .attr("href")
          .replace("/works/", "")
        return {
          name: $(x).text(),
          id: id,
          url: `https://app.idagio.com/works/${id}`
        }
      })
    }
  })
}

const scrapeCategory = async category => {
  const categories = {
    composers: {
      results: await scrapeComposers(),
      fileName: "browse-popular-composers.json"
    },
    performers: {
      results: await scrapePerformers(),
      fileName: "browse-popular-performers.json"
    },
    epochs: {
      results: await scrapeEpochs(),
      fileName: "browse-popular-epochs.json"
    },
    genres: {
      results: await scrapeGenres(),
      fileName: "browse-popular-genres.json"
    },
    instruments: {
      results: await scrapeInstruments(),
      fileName: "browse-popular-instruments.json"
    }
  }

  return categories[category]
}

const saveResults = ({ results, fileName }) => {
  fs.writeFileSync(`out/${fileName}`, JSON.stringify(results, null, 2))
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
}

const main = async () => {
  saveResults(await scrapeCategory("composers"))
  saveResults(await scrapeCategory("instruments"))
}

main().catch(err => {
  console.log(err)
})
