const app = require('./modules/bolt')
const share = require('./modules/share')
const Birthday = require('./modules/birthday')
const dayjs = require('dayjs')

interface User {
  name: String,
  birthday: String
}

async function main() {
  await app.start(3000)
  console.log('⚡️ Bolt app is running!')

  const birthdayList = await (new Birthday(app)).list
  console.log(birthdayList)

  const birthdayPeople = birthdayList.filter((user: User) => {
    const birthday =dayjs(user.birthday).format('YYYYMMDD')
    const today =dayjs().format('YYYYMMDD')

    return !!user.birthday && birthday === today
  })

  console.log('birthdayPeople:', birthdayPeople)

  birthdayPeople.forEach((person: User) => {
    share.postSlack({
      text: `@${person.name} HBD! :tada:`,
      link_names: 1 // @がメンションと解釈されるためのフラグ
    });
  })
}

async function postData(url = ``, data = {}) {
  return await (await (fetch(url, { method: 'POST' }))).json()
}

main()
