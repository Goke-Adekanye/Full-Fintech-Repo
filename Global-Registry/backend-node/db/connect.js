// const { createClient } = require("redis");

// const redisClient = createClient({
//   url: process.env.REDIS_URI,
// });

// module.exports = redisClient;

// Start the server
// const start = async () => {
//   try {
//     // Connect to Redis
//     await redisClient.connect();

//     // Listen on the specified port
//     app.listen(port, () =>
//       console.log(`Server is listening on port ${port}...`)
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
