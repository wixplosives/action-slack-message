/* eslint-disable no-console */
import * as core from '@actions/core';
import { WebClient, LogLevel } from '@slack/web-api';

// WebClient insantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.

async function run(): Promise<void> {
  try {
    const status: string = core.getInput('status');
    const text: string = core.getInput('text');
    const channel: string = core.getInput('channel');
    const slackToken: string = core.getInput('slack_token');
    core.debug(`Processing ${status} ${text} ${channel} ${slackToken}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const client = new WebClient(slackToken, {
      logLevel: LogLevel.DEBUG
    });

    try {
      const result = await client.chat.postMessage({
        channel,
        text,
        attachments: [
          {
            fallback: 'Plain-text summary of the attachment.',
            color: '#2eb886',
            pretext: 'Optional text that appears above the attachment block',
            author_name: 'Bobby Tables',
            author_link: 'http://flickr.com/bobby/',
            author_icon: 'http://flickr.com/icons/bobby.jpg',
            title: 'Slack API Documentation',
            title_link: 'https://api.slack.com/',
            text: 'Optional text that appears within the attachment',
            fields: [
              {
                title: 'Priority',
                value: 'High',
                short: false
              }
            ],
            image_url: 'http://my-website.com/path/to/image.jpg',
            thumb_url: 'http://example.com/path/to/thumb.png',
            footer: 'Slack API',
            footer_icon:
              'https://platform.slack-edge.com/img/default_application_icon.png'
          }
        ]
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
