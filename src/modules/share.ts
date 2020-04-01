require('dotenv').config();

const fetch = require('node-fetch')

const Share = {
  postSlack(body: Object) {
    fetch(process.env.SLACK_INCOMING_WEBHOOK, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
  }
}

export = Share
