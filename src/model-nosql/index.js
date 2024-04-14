const mongoose = require('mongoose');
const { mongodbConfig } = require('../config/index');

let connection = null;

const connect = async () => {
  try {
    console.log(`\t\t-> Host=${mongodbConfig.host} Port=${mongodbConfig.port} Username=${mongodbConfig.username} Database=${mongodbConfig.database}`);
    let url = "";
    if (!mongodbConfig.username && !mongodbConfig.password) {
      url = `mongodb://${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.database}`;
    }else{
      url = `mongodb://${mongodbConfig.username}:${mongodbConfig.password}@${mongodbConfig.host}:${mongodbConfig.port}/${mongodbConfig.database}`;
    }
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(url);
    return connection;
  } catch (ex) {
    throw ex;
  }
};

module.exports = {
  connect: connect,
  getConnection: () => { return connection },
}