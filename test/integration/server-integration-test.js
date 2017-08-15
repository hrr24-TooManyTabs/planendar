const request = require('request');
const express = require('express');
const expect = require('chai').expect;
const bcrypt = require('bcrypt-nodejs');
const app = require('../../server/routes.js');
const handler = require('../../lib/request-handler.js');

const db = require('../../db/config.js');
const User = require('../../db/models/user.js');
const Appointment = require('../../db/models/appointment.js');
const Weather = require('../../db/models/weather.js');
const Reminder = require('../../db/models/reminder.js');
const Reminders= require('../../db/collections/reminders.js');

const testPort = 4568;
const testHost = 'http://localhost:' + testPort;

describe('', function() {
  let server;

  before(() => {
    server = app.listen(testPort, () => {
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
      request(testHost, (err, res, body) => {
        expect(res.req.path).to.equal('/login');
        done();
      });
    });

  });

  describe('Account Creation:', function() {

    it('Signup creates a user record', function(done) {
      let options = {
        'method': 'POST',
        'uri': testHost + '/signup',
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
        'uri': testHost + '/signup',
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
        'uri': testHost + '/login',
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
        'uri': testHost + '/login',
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
          'uri': testHost + '/login',
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

    afterEach((done) => {
      db.knex('appointments')
      .where({
        'title': 'Test title',
        'description': 'Test description',
        'start_date_time': '2017-07-19 01:00',
        'end_date_time': '2017-07-19 02:00',
        'location': 'Dhaka'
      })
      .then(testAppointment => {
        // console.log('testAppointment', testAppointment);
        if(testAppointment[0] === undefined) return;
        db.knex('reminders')
          .where('appointment_id', testAppointment[0].id)
          .del()
          .catch(error => {
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data',
              error: error
            }
          });

        return testAppointment;
      })
      .then((testAppointment) => {
        if(testAppointment === undefined) return;
        db.knex('appointments')
          .where('id', testAppointment[0].id)
          .del()
          .catch(error => {
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data'
            }
          });
      })
      .then(() => done());
    });

    it('Posting a schedule creates a db record', (done) => {
      let options = {
        'method': 'POST',
        'uri': testHost + '/schedule',
        'form': {
          'title': 'Test title',
          'description': 'Test description',
          'start_date_time': '2017-07-19 01:00',
          'end_date_time': '2017-07-19 02:00',
          'location': 'Dhaka',
          'reminders': [ '5', '10', '30' ]
        }
      };

      requestWithSession(options, (err, res, body) => {
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
            'start_date_time': '2017-07-19 01:00',
            'end_date_time': '2017-07-19 02:00',
            'location': 'Dhaka'
          })
          .then(appointment => {
            if(appointment[0] && appointment[0]['title']) {
              var title = appointment[0]['title'];
              var description = appointment[0]['description'];
              var start_date_time = appointment[0]['start_date_time'];
              var end_date_time = appointment[0]['end_date_time'];
              var location = appointment[0]['location'];
            }
            expect(title).to.equal('Test title');
            expect(description).to.equal('Test description');
            expect(start_date_time).to.equal('2017-07-19 01:00');
            expect(end_date_time).to.equal('2017-07-19 02:00');
            expect(location).to.equal('Dhaka');
            done();
          });
      });
    });

    it('Can create a schedule without reminders', (done) => {
      let options = {
        'method': 'POST',
        'uri': testHost + '/schedule',
        'form': {
          'title': 'Test title',
          'description': 'Test description',
          'start_date_time': '2017-07-19 01:00',
          'end_date_time': '2017-07-19 02:00',
          'location': 'Dhaka'
        }
      };

      requestWithSession(options, (err, res, body) => {
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
            'start_date_time': '2017-07-19 01:00',
            'end_date_time': '2017-07-19 02:00',
            'location': 'Dhaka'
          })
          .then(appointment => {
            if(appointment[0] && appointment[0]['title']) {
              var title = appointment[0]['title'];
              var description = appointment[0]['description'];
              var start_date_time = appointment[0]['start_date_time'];
              var end_date_time = appointment[0]['end_date_time'];
              var location = appointment[0]['location'];
            }
            expect(title).to.equal('Test title');
            expect(description).to.equal('Test description');
            expect(start_date_time).to.equal('2017-07-19 01:00');
            expect(end_date_time).to.equal('2017-07-19 02:00');
            expect(location).to.equal('Dhaka');
            done();
          });
      });
    });

    it('Deleting a schedule removes schedule record from db', (done) => {
      let options = {
        'method': 'POST',
        'uri': testHost + '/schedule',
        'form': {
          'title': 'Test Appointment to remove',
          'description': 'Test description',
          'start_date_time': '2017-07-19 01:00',
          'end_date_time': '2017-07-19 02:00',
          'location': 'Dhaka',
          'reminders': [ '5', '10' ]
        }
      };

      requestWithSession(options, (err, res, body) => {
        if(err) {
          console.log('DatabaseError in Adding Schedule for Delete');
          throw {
            type: 'DatabaseError',
            message: 'Failed to create test setup data'
          };
        }

        let responseBody = JSON.parse(body);
        let id = responseBody.id;
        let reminders = responseBody.reminders;
        let options = {
          'method': 'DELETE',
          'uri': testHost + `/schedule/${id}`,
        };

        requestWithSession(options, (err, res, body) => {
          if(err) {
            console.log('DatabaseError in Deleting Schedule');
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data'
            };
          }

          db.knex('appointments')
            .where('id', id)
            .then(found => {
              expect(found).to.be.empty;
            })
            .then(() => {
              db.knex('reminders')
                .where({
                  'appointment_id': id,
                  'id': reminders[0]['id']
                })
                .then(found => {
                  expect(found).to.be.empty;
                });
            })
            .then(() => {
              db.knex('reminders')
                .where({
                  'appointment_id': id,
                  'id': reminders[1]['id']
                })
                .then(found => {
                  expect(found).to.be.empty;
                  done();
                });
            });
        });

      });

    }); // Deleting a schedule removes schedule record from db

    it('Updating a schedule updates record in db', (done) => {
      let options = {
        'method': 'POST',
        'uri': testHost + '/schedule',
        'form': {
          'title': 'Test Appointment to update',
          'description': 'Test description',
          'start_date_time': '2017-07-19 01:00',
          'end_date_time': '2017-07-19 02:00',
          'location': 'Dhaka',
          'reminders': [ '5', '10', '30' ]
        }
      };

      requestWithSession(options, (err, res, body) => {
        if(err) {
          console.log('DatabaseError in Adding Schedule for Delete');
          throw {
            type: 'DatabaseError',
            message: 'Failed to create test setup data'
          };
        }

        let responseBody = JSON.parse(body);
        let id = responseBody.id;
        let reminders = responseBody.reminders;
        let options = {
          'method': 'PUT',
          'uri': `${testHost}/schedule/${id}`,
          'form': {
            'title': 'Test Appointment Updated',
            'description': 'Test description updated',
            'start_date_time': '2017-07-20 02:00',
            'end_date_time': '2017-07-20 03:00',
            'location': 'New York',
            'reminders': [ '15', '30' ]
          }
        };

        requestWithSession(options, (err, res, body) => {
          if(err) {
            console.log('DatabaseError in Deleting Schedule');
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data'
            };
          }

          db.knex('appointments')
            .where('id', id)
            .then(updatedAppointment => {
              if(updatedAppointment[0] && updatedAppointment[0]['title']) {
                var title = updatedAppointment[0]['title'];
                var description = updatedAppointment[0]['description'];
                var start_date_time = updatedAppointment[0]['start_date_time'];
                var end_date_time = updatedAppointment[0]['end_date_time'];
                var location = updatedAppointment[0]['location'];
              }
              expect(title).to.equal('Test Appointment Updated');
              expect(description).to.equal('Test description updated');
              expect(start_date_time).to.equal('2017-07-20 02:00');
              expect(end_date_time).to.equal('2017-07-20 03:00');
              expect(location).to.equal('New York');

              let updatedAppointmentId = updatedAppointment[0].id;

              db.knex('appointments')
                .where('id', updatedAppointmentId)
                .del()
                .catch(error => {
                  throw {
                    type: 'DatabaseError',
                    message: 'Failed to delete updated appointment',
                    error: error
                  }
                });

              return updatedAppointmentId;
            })
            .then(updatedAppointmentId => {
              db.knex('reminders')
                .where({
                  'appointment_id': updatedAppointmentId,
                  'minutes': 5
                })
                .then(found => {
                  expect(found).to.be.empty;
                });
              return updatedAppointmentId;
            })
            .then(updatedAppointmentId => {
              db.knex('reminders')
                .where({
                  'appointment_id': updatedAppointmentId,
                  'minutes': 15
                })
                .then(updatedReminder => {
                  expect(updatedReminder[0]['minutes']).to.equal(15);
                });
              return updatedAppointmentId;
            })
            .then(updatedAppointmentId => {
              db.knex('reminders')
                .where({
                  'appointment_id': updatedAppointmentId,
                  'minutes': 30
                })
                .then(updatedReminder => {
                  expect(updatedReminder[0]['minutes']).to.equal(30);
                });

              return updatedAppointmentId;
            })
            .then(updatedAppointmentId => { // delete updated reminders after testing
              db.knex('reminders')
                .where('appointment_id', updatedAppointmentId)
                .andWhere('minutes', 'in', [15, 30])
                .del()
                .then(() => done());
            });
        });
      });
    }); // Updating a schedule updates record in db
  }); // Scheduling

  describe('Weather data', function() {
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
          'uri': testHost + '/login',
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

    afterEach((done) => {
      db.knex('appointments')
      .where({
        'title': 'Test title',
        'description': 'Test description',
        'start_date_time': '2017-07-19 01:00',
        'end_date_time': '2017-07-19 02:00',
        'cityName': 'New York',
        'isTrackingWeather': 'true'
      })
      .then(testAppointment => {
        // console.log('testAppointment', testAppointment);
        if(testAppointment[0] === undefined) return;
        db.knex('reminders')
          .where('appointment_id', testAppointment[0].id)
          .del()
          .catch(error => {
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data',
              error: error
            }
          });

        return testAppointment;
      })
      .then((testAppointment) => {
        if(testAppointment === undefined) return;
        db.knex('appointments')
          .where('id', testAppointment[0].id)
          .del()
          .catch(error => {
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data'
            }
          });
      })
      .then(() => done());
    }); // afterEach

    xit('Adds weather data when an appointment with new city is posted', function (done) {
      this.timeout(3000);
      let options = {
        'method': 'POST',
        'uri': testHost + '/schedule',
        'form': {
          'title': 'Test title',
          'description': 'Test description',
          'start_date_time': '2017-07-19 01:00',
          'end_date_time': '2017-07-19 02:00',
          'cityName': 'New York',
          'isTrackingWeather': 'true'
        }
      };

      requestWithSession(options, (err, res, body) => {
        if(err) {
          console.log('DatabaseError in Weather Data');
          throw {
            type: 'DatabaseError',
            message: 'Failed to create test setup data'
          };
        }

        let options = {
          'method': 'GET',
          'uri': testHost + '/allweather'
        };

        setTimeout(() => {
          requestWithSession(options, (err, res, body) => {
            let found = false;
            weatherData = JSON.parse(body);
            weatherData.forEach(weather => {
              if(weather.location && weather.location.name === 'New York') {
                found = true;
              }
            });
            expect(found).to.be.true;
            done();
          });
        }, 2500);
      });
    });
  }); // Weather Data
});
