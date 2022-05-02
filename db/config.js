import mongoose from 'mongoose'
import Logger from '../utils/logger.js';

const connect = async => {
    const dbUri = `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASS}@clusterdashboard.lkbnt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  
    return mongoose
      .connect(dbUri)
      .then(() => {
      })
      .catch((error) => {
        Logger.error(error)
        process.exit(1);
      });
  };

export default connect