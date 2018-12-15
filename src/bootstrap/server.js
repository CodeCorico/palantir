require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 80;

const statics = process.env.SERVER_STATICS || null;

const resolve = (file) => path.join(__dirname, '../../', file);

if (statics) {
  app.use(express.static(statics));
}
app.use(express.static(resolve('dist')));

app.use((req, res) => {
  if (req.accepts('html')) {
    res.sendFile(resolve('dist/index.html'));
  } else if (req.accepts('json')) {
    res.status(404).send({ error: 'Not found' });
  } else {
    res.status(404).type('txt').send('Not found');
  }
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server started on :${port}`));
