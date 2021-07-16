const cors = require('cors');
const whitelist = ["http://localhost:3000" , "https://localhost3443" , "http://localhost:9000"]

module.exports.cors = cors();

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('CORS ERROR: Not allowed by CORS'))
        }
      }
}
module.exports.corsWithOpts = cors()