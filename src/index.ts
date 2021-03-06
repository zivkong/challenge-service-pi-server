import dotenv from 'dotenv'

dotenv.config()

import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'

import { healthCheck, getPiRecord, getSunCircumference } from './services/service.query'
import { resetPiRecords } from './services/service.mutate'

const fastify: FastifyInstance = Fastify({})

fastify.register(require('@fastify/cors'), {
  methods: ['GET', 'POST'],
  origin: '*',
})

// GETTERS
fastify.get('/health/check', healthCheck)
fastify.get('/pi', getPiRecord)
fastify.get('/circumference/sun', getSunCircumference)

// SETTERS
fastify.post('/pi/reset', resetPiRecords)

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })

    const address = fastify.server.address()
    const port = typeof address === 'string' ? address : address?.port

    console.log(`Pi Service is serving at http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
