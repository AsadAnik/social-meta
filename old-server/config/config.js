//This file holds any configuration variables we may need
//'config.js' is usually ignored by git to protect sensitive information, such as your database's username and password

// module.exports = {
// 	db: {
// 		uri: 'mongodb://localhost:27017/socialMeta',
// 	}
// };

const config = {
    production: {
        SECRET: process.env.SECRET,
        MONGO_URI: process.env.MONGO_URI,
        HOST: process.env.HOST,
        PORT: process.env.PORT
    },
    default: {
        SECRET: 'SUPERSECRET',
        MONGO_URI: 'mongodb://localhost:27017/socialMeta',
        HOST: 'localhost',
        PORT: 8080
    }
};

exports.get = function get(env){
    return config[env] || config.default;
};