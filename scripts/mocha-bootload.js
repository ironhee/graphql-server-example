require('babel/register')({
  optional: ['runtime'],
});

var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
