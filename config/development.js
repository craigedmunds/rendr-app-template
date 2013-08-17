// Config settings for NODE_ENV=development

exports.config = {
  assets: {
    minify: false,
    cdn: {
      protocol: 'http',
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
      host: 'localhost:3000',
      protocol: 'http'
    }
  },

  rendrApp: {
    someProperty: 'someValue'
  }
};
