'use strict'

const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const { DynamoDB } = require('aws-sdk')

/**
 * Defines
 */
const dynamoDb = new DynamoDB.DocumentClient()

/**
 * Uses
 */
app.use(bodyParser.json({ strict: false }));

/**
 * Routes
 */
app.get('/', function(req, res) {
  const params = {
    TableName: process.env.USERS_TABLE
  }

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      res.status(400).json({
        error: 'Bad request'
      })
    }

    res.status(200).json({
      data: result.Items
    })
  })
})

app.post('/', function(req, res) {
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      id: req.body.id,
      name: req.body.name
    }
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      res.status(400).json({
        error: 'Bad request'
      })
    }

    res.status(201).json({
      data: {
        id: req.body.id,
        name: req.body.name
      }
    })
  });
})

app.get('/:id', function (req, res) {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: req.params.id
    }
  }

  dynamoDb.get(params, (error, result) => {
    if(error) {
      res.status(400).json({
        error: 'Bad request'
      })
    }

    if(result.Item) {
      res.status(200).json({
        data: result.Item
      })
    } else {
      res.status(404).json({
        error: 'Ean not found.'
      })
    }
  })
})

module.exports.application = serverless(app)
