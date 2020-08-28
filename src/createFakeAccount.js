const got = require("got")
const FormData = require("form-data")
const fs = require("fs")

const main = async () => {
  const form = new FormData()
  form.append("email", "vimufexuko8@techno5.club")
  form.append("password", "sidaismettila")
  form.append("plan", "Premium_trial_opt_in")
  // Range: [1, 7]. If commented the duration is of 4 Months!!!
  // form.append("plan_duration_days", 7)
  form.append("username", "vimufexuko8@techno5.club")

  try {
    const res = JSON.parse(
      (await got.post("https://api.idagio.com/v2.1/user", {
        body: form
      })).body
    )

    const fileName = "account-data.json"
    fs.writeFileSync(`out/${fileName}`, JSON.stringify(res, null, 2))
  } catch (err) {
    console.log(`Error: ${err.message}`)
  }
}

main().catch(err => {
  console.log(err)
})
