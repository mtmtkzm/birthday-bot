const app = require('./modules/bolt')
const Birthday = require('./modules/birthday')

async function main () {
  await app.start(3000)
  console.log('⚡️ Bolt app is running!')

  const birthday = new Birthday(app)
  const birthdayList = await birthday.list

  console.log('birthdayList:', birthdayList) // [ '2020-04-09', undefined ]
}

main()
