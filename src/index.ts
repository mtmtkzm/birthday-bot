const app = require('./modules/bolt')
const share = require('./modules/share')
const Birthday = require('./modules/birthday')
const dayjs = require('dayjs')

const formatDate = (date?: String) => dayjs(date).format('YYYYMMDD')

interface User {
  name: String,
  birthday: String,
  user_id: String
}

async function main() {
  await app.start(3000)
  console.log('⚡️ Bolt app is running!')

  const birthdayList = await (new Birthday(app)).list

  const birthdayPeople = birthdayList.filter((user: User) => {
    const birthday = formatDate(user.birthday)
    const today = formatDate()

    return !!user.birthday && birthday === today
  })

  birthdayPeople.forEach((person: User) => {
    share.postSlack({
      "username": "birthday",
      "icon_emoji": ":gift:",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `<@${person.user_id}> :tada: Happy Birthday!`
          }
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "Happy Birthday!",
            "emoji": true
          },
          "image_url": "https://media.giphy.com/media/LRCZEnOZRmAOE1MEWM/giphy.gif",
          "alt_text": "image"
        }
      ]
    });
  })
}

async function postData(url = ``, data = {}) {
  return await (await (fetch(url, { method: 'POST' }))).json()
}

main()
