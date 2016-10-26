module.exports = {
  servers: {
    one: {
      host: '137.112.40.146',
      username: 'csse',
      // pem:
      password: 'coo9cuom',
      // or leave blank for authenticate from ssh-agent
    },
  },

  // Install MongoDB on the server. Does not destroy the local MongoDB on future setups
  setupMongo: true,

  appName: 'meteorExpenseReport',

  meteor: {
    name: 'meteorExpenseReport',
    path: '../',
    servers: {
      one: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      PORT: 8000,
      ROOT_URL: 'http://137.112.40.146',
      MAIL_URL: 'smtp://meteor.no.reply%40gmail.com:Password&123@smtp.gmail.com:465',
    },

    // dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60,
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
