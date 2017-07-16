var app = require('../server/server.js');
var express = require('express');
var path = require('path');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: 'planendar.sql'
  },
  useNullAsDefault: true
})

var database = require('Bookshelf')(knex);

database.knex.schema.createTable('users', function(users) {
  users.increments('id').primary();
  users.string('email', 254);
  users.string('password', 254);
}).then((table) => {
  console.log("users table exists, ", table);
})

database.knex.schema.createTable('appointments', function(appointments) {
  appointments.increments('id').primary();
  appointments.integer('user_id');
  appointments.foreign('user_id').references('users.id');
  appointments.string('title', 140);
  appointments.string('description', 300);
  appointments.date('start_date');
  appointments.dateTime('start_date_time');
  appointments.date('end_date');
  appointments.dateTime('end_date_time');
}).then((table) => {
  console.log("appointments table exists, ", table);
})

database.knex.schema.createTable('reminders', function(reminders) {
  reminders.increments('id').primary();
  reminders.integer('appointment_id');
  reminders.foreign('appointment_id').references('appointments.id');
  reminders.string('description', 300);
  reminders.integer('minutes');
}).then((table) => {
  console.log("reminders table exists, ", table);
})

module.exports = database;