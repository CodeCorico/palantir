# Slack

## SocketIO Client-Server Event Handler

Emit event with type `slackMessage` from client to send message to slack.

Parameters:
- slackMessage <string>
- slackChannelId <string>

Example (client-side):

```javascript
import io from 'socket.io-client';

const socket = io.connect('/');

socket.emit('slackMessage', 'Hello, here a message from client', slackChannel);
```