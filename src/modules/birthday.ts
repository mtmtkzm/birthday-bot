require('dotenv').config();

const TARGET_CHANNEL_ID = 'C053W5ARA'
const BIRTHDAY_FIELDS_KEY = 'XfR7AAL22U'

const isExists = (target: any) => !!target

class Birthday {
  app: any;

  constructor(app: any) {
    this.app = app
  }

  get list() {
    return (async () => {
      const userIdList = await this._getUserIdList(TARGET_CHANNEL_ID)
      const promises = userIdList.map((id: string) => this._getUserBirthday(id))

      return (await Promise.all(promises)).filter(isExists);
    })();
  }

  async _getUserBirthday(userId: string) {
    const user = await this.app.client.users.profile.get({
      token: process.env.SLACK_USER_TOKEN,
      user: userId
    });

    return user.profile.fields?.[BIRTHDAY_FIELDS_KEY]?.value
      ? {
          user_id: userId,
          name: user.profile.display_name || user.profile.real_name,
          birthday: user.profile.fields[BIRTHDAY_FIELDS_KEY].value
        }
      : undefined
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
