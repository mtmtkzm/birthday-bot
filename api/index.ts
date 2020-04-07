const app = require('./modules/bolt')
const share = require('./modules/share')
const Birthday = require('./modules/birthday')
const dayjs = require('dayjs')
require('dayjs/locale/ja')

const formatDate = (date?: String) => dayjs(date).format('')

interface User {
  name: String,
  birthday: String,
  user_id: String
}

import {NowRequest, NowResponse} from '@now/node'

app.start(3000)

export default async (req: NowRequest, res: NowResponse) => {
  const birthdayList = await (new Birthday(app)).list

  const birthdayPeople = birthdayList.filter((user: User) => {
    const birthday = formatDate(user.birthday)
    const today = formatDate()

    return !!user.birthday && birthday === today
  })

  const promises = birthdayPeople.map((person: User) => {
    return share.postSlack({
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

  await Promise.all(promises);

  return res.json({ "ok": true })
}
