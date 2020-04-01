const app = require('./modules/bolt')
const Birthday = require('./modules/birthday')
const dayjs = require('dayjs')
const SLACK_WEBHOOK_URL = process.env.SLACK_INCOMING_WEBHOOK

interface User {
  name: String,
  birthday: String
}

async function main() {
  await app.start(3000)
  console.log('⚡️ Bolt app is running!')

  const birthdayList = await (new Birthday(app)).list

  const birthdayPeople = birthdayList.filter((user: User) => {
    return !!user.birthday && dayjs(user.birthday).isSame(dayjs())
  })

  console.log('birthdayPeople:', birthdayPeople)
}

async function postData(url = ``, data = {}) {
  return await (await (fetch(url, {method: "POST"}))).json()
}

main()
