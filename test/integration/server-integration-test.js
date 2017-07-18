const request = require('request');
const express = require('express');
const expect = require('chai').expect;
const bcrypt = require('bcrypt-nodejs');
const app = require('../../server/routes.js');
const db = require('../../db/config.js');
const handler = require('../../lib/request-handler.js');

const User = db.Model.extend({
  tableName: 'users'
});

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

  describe('Priviledged Access', () => {

    it('Redirects a non signed in user from home page to login page', (done) => {
      request('http://localhost:4568', (err, res, body) => {
        expect(res.req.path).to.equal('/login');
        done();
      });
    });

  });

  describe('Account Creation:', function() {

    it('Signup creates a user record', function(done) {
      let options = {
        'method': 'POST',
        'uri': 'http://localhost:4568/signup',
        'form': {
          'name': 'Test User',
          'email': 'testuser@test.com',
          'password': 'testpass'
        }
      };

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

    it('Signup logs in a new user', (done) => {
      let options = {
        'method': 'POST',
        'uri': 'http://localhost:4568/signup',
        'form': {
          'name': 'Test User',
          'email': 'testuser@test.com',
          'password': 'testpass'
        }
      };

      request(options, (err, res, body) => {
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

  });

  describe('Account Login:', (params) => {

    let requestWithSession = request.defaults({jar: true});

    let hashedPass = bcrypt.hashSync('testpass', null);

    beforeEach((done) => {
      new User({
        'name': 'Test User',
        'email': 'testuser@test.com',
        'password': hashedPass
      })
      .save()
      .then(() => done());
    });

    it('Logs in an existing user', (done) => {
      let options = {
        'method': 'POST',
        'uri': 'http://localhost:4568/login',
        'form': {
          'email': 'testuser@test.com',
          'password': 'testpass'
        }
      };

      requestWithSession(options, (err, res, body) => {
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

    it('Keeps Non-existing user to login page', (done) => {
      let options = {
        'method': 'POST',
        'uri': 'http://localhost:4568/login',
        'form': {
          'email': 'nonexisting@user.com',
          'password': 'password'
        }
      };

      requestWithSession(options, (err, res, body) => {
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });

  }); // Account Login

  describe('Scheduling', () => {
    let requestWithSession = request.defaults({jar: true});

    let hashedPass = bcrypt.hashSync('testpass', null);

    beforeEach((done) => {
      new User({
        'name': 'Test User',
        'email': 'testuser@test.com',
        'password': hashedPass
      })
      .save()
      .then(() => {
        let options = {
          'method': 'POST',
          'uri': 'http://localhost:4568/login',
          'form': {
            'email': 'testuser@test.com',
            'password': 'testpass'
          }
        };
        requestWithSession(options, (err, res, body) => {
          done();
        });
      });
    }); // beforeEach

    it('Posting a schedule creates a db record', (done) => {
      let options = {
        'method': 'POST',
        'uri': 'http://localhost:4568/schedule',
        'form': {
          'title': 'Test title',
          'description': 'Test description',
          'start_date': 'start_date',
          'start_date_time': 'start_date_time',
          'end_date': 'end_date',
          'end_date_time': 'end_date_time'
        }
      };

      requestWithSession(options, (err, res, body) => {
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

  }; // Scheduling

});
