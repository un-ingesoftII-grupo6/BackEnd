//Starts the server in different file for development/testing functions
const app = require('./index.js')
const logger = require('./logger/logger');

app.listen(app.get('port'), () => {
    logger.info('Server on port ' + app.get('port'));
});