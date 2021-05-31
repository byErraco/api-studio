if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const server = require('./server');


// server.listen(server.get('port'), () => {
//     console.log('Server on port', server.get('port'));
//     console.log('Environment:', process.env.NODE_ENV);
// })