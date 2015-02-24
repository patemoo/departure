/**
* Save.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    airline: {
      type: 'string',
      required: true
    },
    flight: {
      type: 'string',
      required: true
    },
    year: {
      type: 'string',
      required: true
    },
    month: {
      type: 'string',
      required: true
    },
    day: {
      type: 'string',
      required: true
    },
    path: {
      type: 'string',
      required: true
    },

    //associations

    owner: {
      model: 'User'
    }
  }
};

