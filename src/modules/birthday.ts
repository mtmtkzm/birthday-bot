require('dotenv').config();

const TARGET_CHANNEL = 'C053W5ARA'
const BIRTHDAY_FIELDS_KEY = 'XfR7AAL22U'

class Birthday {
  app: any;

  constructor(app: any) {
    this.app = app
  }

  get list() {
    return (async () => {
      const userIdList = await this._getUserIdList(TARGET_CHANNEL)
      const promises = userIdList.map((id: string) => this._getUserBirthday(id))

      return await Promise.all(promises);
    })();
  }

  async _getUserBirthday(userId: string) {
    const usersProfileGet = await this.app.client.users.profile.get({
      token: process.env.SLACK_USER_TOKEN,
      user: userId
    });

    return usersProfileGet?.profile?.fields?.[BIRTHDAY_FIELDS_KEY]?.value
  }

  async _getUserIdList (channelId: string) {
    const channelsInfo = await this.app.client.channels.info({
      token: process.env.SLACK_USER_TOKEN,
      channel: channelId
    })

    return channelsInfo.channel.members
  }
}

export = Birthday
