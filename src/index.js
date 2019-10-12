import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import './config/mongoose';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

routes(app);

app.all('*', (req, res) => res.status(404).json({
  success: false,
  message: 'The page you are looking for does not exist'
}));

const PORT = process.env.PORT || 2000;
app.listen(PORT, console.info(`server started on port ${PORT}`));

export default app;
