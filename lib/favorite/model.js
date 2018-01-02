'use strict';

const Checkit = require('checkit');
const bookshelf = require('../bookshelf');

require('../article/model');
require('../user/model');

const Model = bookshelf.Model.extend({
  tableName: 'favorites',

  getValidators() {
    return {
      article: [
        'required',
        'number',
        this.unsafeValidateUnique(
          ['user', 'article'],
          'has already been favorited',
        ),
      ],
      user: ['required', 'number'],
    };
  },

  article() {
    return this.belongsTo('Article', 'article');
  },

  user() {
    return this.belongsTo('User', 'user');
  },

  initialize() {
    this.on('saving', this.handleSaving);
  },

  async handleSaving(model, attrs, options) {
    const checkit = new Checkit(this.getValidators(), {
      messages: {
        required: `can't be blank`,
      },
    });

    await checkit.run(this.attributes, options);
  },
});

module.exports = bookshelf.model('Favorite', Model);