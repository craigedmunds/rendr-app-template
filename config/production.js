// Config settings for NODE_ENV=production

exports.config = {
  assets: {
    minify: true,
    cdn: {
      protocol: 'https',
      cnames: ['localhost'],
      pathPrefix: ''
    }
  },

  api: {
    'default': {
      host: 'api.github.com',
      protocol: 'https'
    },
    'travis-ci': {
      host: 'api.travis-ci.org',
      protocol: 'https'
    },
    'testservice': {
      host: 'shrouded-coast-2114.herokuapp.com',
      protocol: 'http'
    }
  },

  rendrApp: {
    someProperty: 'someValue'
  }
};
