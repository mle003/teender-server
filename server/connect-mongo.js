const mongoose = require("mongoose")
const USERNAME = process.argv[2]
const PASSWORD = process.argv[3]

if (!USERNAME || !PASSWORD)
  throw new Error('Missing username/password for mongo')

const connectionString = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.twblj.mongodb.net/Teender?retryWrites=true&w=majority`
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect success to MongoDB")
  })
  .catch((err) => {
    console.error("Connect failed to MongoDB")
    console.error(err)
  });
