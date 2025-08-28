import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';

const app = express();
const port = 4000;

app.use(bodyParser.json());

const checkApiKey = async function (req, res, next) {
  const {xapikey} = req.headers

  if(xapikey !== '123') {
    res.status(401).send('Unauthorized, your API key is incorrect');
  }

  next()
}

app.use(checkApiKey);

app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});