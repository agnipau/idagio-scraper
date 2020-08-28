const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const yaml = require('js-yaml')

const saveToYaml = ({ filename, data }) => {
  fs.writeFileSync(`${filename}.yaml`, yaml.safeDump(data))
  console.log(
    `${chalk.green('==>')} ${chalk.magenta(`${filename}.yaml`)} saved`
  )
}

const main = () => {
  const favRecordingsPath = path.join(
    path.dirname(__dirname),
    'out/fav-recordings.json'
  )
  const favTracksPath = path.join(
    path.dirname(__dirname),
    'out/fav-tracks.json'
  )

  const recordings = JSON.parse(fs.readFileSync(favRecordingsPath))
    .map(x =>
      x.results.map(y => {
        return {
          url: `https://app.idagio.com/recordings/${y.id}`,
          composer: y.work.composer.name,
          recordingTitle: y.work.title
        }
      })
    )
    .flat()
  const tracks = JSON.parse(fs.readFileSync(favTracksPath))
    .map(x =>
      x.results.map(y => {
        return {
          url: `https://app.idagio.com/recordings/${y.recording.id}#t=${y.id}`,
          composer: y.piece.workpart.work.composer.name,
          recordingTitle: y.piece.workpart.work.title,
          trackTitle: y.piece.title
        }
      })
    )
    .flat()

  saveToYaml({
    filename: 'idagio-fav-recordings',
    data: recordings
  })
  saveToYaml({
    filename: 'idagio-fav-tracks',
    data: tracks
  })
}

main()
