# Speech Synthesis

## Require

- Google Cloud Speech-to-Text API Credentials https://cloud.google.com/speech-to-text/?hl=fr

## Palantir Configuration

Allows you to easily add voice synthesis as an app with minimal code. Use it by adding an app with type `speech-synthesis` in your `palantir.json` config file. 

You also need to specify a path to your `GOOGLE_APPLICATION_CREDENTIALS` JSON by adding a variable named `gapi-credentials-path`. Be aware that you need a credential with valid Google Cloud Speech-to-Text API access and rights. 

I also strongly advise you to add a quota to this access to avoid any unwanted cost.

### Example

```
"variables": {
  "slack-token": "<SLACK_TOKEN>",
  "gapi-credentials-path": "<GOOGLE_APPLICATION_CREDENTIALS_JSON_PATH>"
},
"apps": {
  "speech-synthesis": {
    "type": "speech-synthesis",
    "tasks": [
      {
        "id": "slack-say",
        "slackCommand": "say",
        "trigger": "start"
      },
      ...
    ]
  },
  ...
}
```