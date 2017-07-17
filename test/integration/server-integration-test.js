const request = require('request');
const express = require('express');
const expect = require('chai').expect;
const app = require('../../server/routes.js');
const db = require('../../db/config.js');
const handler = require('../../lib/request-handler.js');

describe('', function() {
  let server;

  before(() => {
    server = app.listen(4568, () => {
      console.log('Planendar is listening to 4568');
    });
  });

  after(() => {
    server.close();
  });

  beforeEach(() => {
    // request('http://localhost:4568/logout', (err, res, body) => {});

    db.knex('users')
      .where('email', '=', 'testuser@test.com')
      .del()
      .catch(error => {
        throw {
          type: 'DatabaseError',
          message: 'Failed to create test setup data'
        }
      });

  });

  describe('Account Creation', function() {

    it('Signup creates a user record', function(done) {
      let options = {
        'method': 'POST',
        'uri': 'http://localhost:4568/signup',
        'form': {
          'name': 'Test User',
          'email': 'testuser@test.com',
          'password': 'testpass'
        }
      }

      request(options, (err, res, body) => {
        if(err) {
          console.log('DatabaseError in Account Creation');
          throw {
            type: 'DatabaseError',
            message: 'Failed to create test setup data'
          };
        }

        db.knex('users')
          .where('email', '=', 'testuser@test.com')
          .then(user => {
            if(user[0] && user[0]['name'] && user[0]['email']) {
              var name = user[0]['name'];
              var email = user[0]['email'];
            }
            expect(name).to.equal('Test User');
            expect(email).to.equal('testuser@test.com');
            done();
          });
      });
    });
  });
});
