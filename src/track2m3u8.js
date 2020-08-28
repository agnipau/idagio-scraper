const got = require("got")
const fs = require("fs")
const chalk = require("chalk")

const saveJson = ({ body, quality, trackId }) => {
  const fileName = `${trackId}-m3u8.json`
  const filePath = `out/${fileName}`
  fs.writeFileSync(
    `${filePath}`,
    JSON.stringify({ body, quality, trackId }, null, 2)
  )
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
  return filePath
}

const saveM3u8 = ({ body, ...rest }) => {
  const fileName = `${rest.trackId}.m3u8`
  const filePath = `out/${fileName}`
  fs.writeFileSync(`${filePath}`, body)
  console.log(`${chalk.green("==>")} ${chalk.magenta(`'${fileName}'`)} saved`)
  return filePath
}

// quality = 1<=x<=30 -> 320-prv
// quality = 31<=x<=60 -> 160
// quality = 61<=x<=80 -> 320
const getM3u8 = async ({ trackId, quality }) => {
  const { body } = await got.get(
    `https://api.idagio.com/v1.8/track/${trackId}.m3u8?quality=${quality}&client_type=android-1`,
    {
      headers: {
        authorization:
          "Bearer 2V0q422n2X3i3Z0H3K1Y0Y1e3d203C0a1j2o0R1f331Q2q2a3p0P3T273s402r3y270c2K3f3O102D0h0B2s45440n2Y2q2I1D32282d0B0e361h293s3C31260U0O3m"
      }
    }
  )
  return {
    body,
    quality,
    trackId
  }
}

const main = async () => {
  const m3u8 = await getM3u8({
    trackId: "23145233",
    quality: 80
  })
  saveJson(m3u8)
  saveM3u8(m3u8)
}

if (require.main == module)
  main().catch(err => {
    console.log(err)
  })

module.exports = {
  getM3u8,
  saveM3u8,
  saveJson
}
