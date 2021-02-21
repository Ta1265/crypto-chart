import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../client/dist`));

export default app;
