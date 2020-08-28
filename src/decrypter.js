const got = require("got")
const fs = require("fs")
const chalk = require("chalk")
const WebCrypto = require("node-webcrypto-ossl")
const crypto = new WebCrypto()

// Decrypts an encrypted password
const decryptPsw = (encryptedPsw, num) => {
  const n = parseInt(num, 10) % 65536
  return 0 === n
    ? encryptedPsw
    : String.fromCharCode.apply(
        null,
        encryptedPsw.split("").map(x => (x.charCodeAt(0) + n + 65536) % 65536)
      )
}

// Converts the hashed password to a string
const hashPswToString = password => {
  const res = []
  const data = new DataView(password)
  for (let i = 0; i < data.byteLength; i += 4) {
    const u32 = data.getUint32(i)
    const hex = u32.toString(16)
    res.push(("00000000" + hex).slice(-"00000000".length))
  }
  return res.join("")
}

// Encode the password as UTF-8
const pwUtf8 = password => new TextEncoder("utf-8").encode(password)

// Hash the password
const pwHash = password => crypto.subtle.digest("SHA-256", pwUtf8(password))

// Returns the generated key
const generateKey = async password => {
  const hashedPsw = await pwHash(password)
  const stringPsw = await hashPswToString(hashedPsw.slice(0, 8))
  const utf8Psw = await pwUtf8(stringPsw)
  return crypto.subtle.importKey("raw", utf8Psw, { name: "AES-CTR" }, false, [
    "decrypt"
  ])
}

// Computes the counter
const computeCounter = (utf8Iv, blockIndex) => {
  for (let i = 0; i < blockIndex; i++)
    for (let j = 15; j >= 0; j--) {
      if (255 !== utf8Iv[j]) {
        utf8Iv[j]++
        break
      }
      utf8Iv[j] = 0
    }
  return utf8Iv
}

const main = async () => {
  try {
    // Probably .length is the counter. If in doubt, it is better to continue to
    // use 0 as the counter to decrypt
    const url = JSON.parse(
      (await got.get(
        "https://api.idagio.com/v1.8/content/track/30585297?quality=10&format=2&client_type=web-2&client_version=13.19.14&device_id=web"
      )).body
    ).url

    // Buffer crypted in AES-CTR 128 bit
    const encryptedBuffer = await new Promise((resolve, reject) => {
      const chunks = []
      const stream = got.stream(url)
      stream.on("data", chunk => {
        chunks.push(chunk)
      })
      stream.on("end", () => {
        resolve(Buffer.concat(chunks))
      })
      stream.on("error", reject)
    })

    // Destructuring of the query parameter that contains the keyBase and the iv
    const [keyBase, iv] = url.split("xx=")[1].split("-")
    const blockIndex = 0

    // Decryption of the encrypted buffer
    const encryptedPsw = "mola*jbaf^*`*V^fG^lkf4fb_bba2"
    const decryptedPsw = decryptPsw(encryptedPsw, 3)
    const aesKey = await generateKey(keyBase + decryptedPsw)
    const counter = computeCounter(pwUtf8(iv), blockIndex)
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-CTR", counter: counter, length: 128 },
      aesKey,
      new Uint8Array(encryptedBuffer)
    )

    // Save the new buffer
    fs.writeFileSync("song.mp3", new Uint8Array(decryptedArrayBuffer))
  } catch (err) {
    console.log(`${chalk.red(">>")} ${err.message}`)
  }
}

main().catch(err => {
  console.log(err)
})
