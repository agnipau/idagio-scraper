const got = require('got')
const fs = require('fs')
const chalk = require('chalk')

const authToken =
  '2d0V3b1g3Z3E1k0i3P3x0H0r2S3j3I2E0p3r3u112K062Z0r2M0d2h1i3C291Z1g343V0x2w1W0i1N2l0R240s383O0v1Q0k122s2O2A1u2y3K3u2e2c3I0m2t243l1q'

const saveToJson = ({ obj, fileName }) => {
  fs.writeFileSync(`out/${fileName}.json`, JSON.stringify(obj, null, 2))
}

const scrapeFavourites = async collection => {
  const firstPage = JSON.parse(
    (await got.get(`https://api.idagio.com/v2.0/me/favorites/${collection}`, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })).body
  )

  const results = [firstPage]
  for (
    let i = firstPage.meta.limit;
    i < firstPage.meta.total;
    i += firstPage.meta.limit
  ) {
    const url = `https://api.idagio.com/v2.0/me/favorites/${collection}?cursor=${i}`
    results.push(
      JSON.parse(
        (await got.get(url, {
          headers: {
            authorization: `Bearer ${authToken}`
          }
        })).body
      )
    )
    console.log(`${chalk.green('==>')} ${chalk.cyan(url)}`)
  }
  console.log()

  return results.flat()
}

const main = async () => {
  const collections = {
    recordings: 'recordings',
    tracks: 'tracks'
  }
  Object.values(collections).map(async x => {
    saveToJson({ obj: await scrapeFavourites(x), fileName: `fav-${x}` })
  })
}

main().catch(err => {
  console.log(err)
})
