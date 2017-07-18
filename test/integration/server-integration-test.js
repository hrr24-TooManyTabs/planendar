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
const Appointment = db.Model.extend({
  tableName: 'appointments'
});
const Reminder = db.Model.extend({
  tableName: 'reminders'
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
          'start_date': '2017-07-19',
          'start_date_time': '01:00',
          'end_date': '2017-07-19',
          'end_date_time': '02:00',
          'location': 'Dhaka',
          'reminders': [ '5', '10', '30' ]
        }
      };

      requestWithSession(options, (err, res, body) => {
        // expect(true).to.equal(true);
        if(err) {
          console.log('DatabaseError in Account Creation');
          throw {
            type: 'DatabaseError',
            message: 'Failed to create test setup data'
          };
        }

        db.knex('appointments')
          .where({
            'title': 'Test title',
            'description': 'Test description',
            'start_date': '2017-07-19',
            'start_date_time': '01:00',
            'end_date': '2017-07-19',
            'end_date_time': '02:00',
            'location': 'Dhaka'
          })
          .then(appointment => {
            if(appointment[0] && appointment[0]['title']) {
              var title = appointment[0]['title'];
              var description = appointment[0]['description'];
              var start_date = appointment[0]['start_date'];
              var start_date_time = appointment[0]['start_date_time'];
              var end_date = appointment[0]['end_date'];
              var end_date_time = appointment[0]['end_date_time'];
              var location = appointment[0]['location'];
            }
            expect(title).to.equal('Test title');
            expect(description).to.equal('Test description');
            expect(start_date).to.equal('2017-07-19');
            expect(start_date_time).to.equal('01:00');
            expect(end_date).to.equal('2017-07-19');
            expect(end_date_time).to.equal('02:00');
            expect(location).to.equal('Dhaka');
            done();
          });
      });
    });

    xit('Posting a schedule without end_date saves the end_date as the start_date', (done) => {
      // code
    });

  }); // Scheduling

});
