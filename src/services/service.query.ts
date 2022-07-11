import mongoose from 'mongoose'
import fetch from 'cross-fetch'

import { PiIterationSchema } from './schemas/PiIteration.schema'

import { IPiGeneratorResponse } from './interfaces'

const db = mongoose.createConnection(process.env.READ_DB_CONN)
const PiIteration = db.model('PiIteration', PiIterationSchema)

export const healthCheck = (request, reply) => {
  reply.send({ status: 'OK' })
}

const getLastPiRecord = async (message: string) => {
  // Try to retrieve existing record and return it in case Pi generator failed
  try {
    const latestPiRecord = await PiIteration.findOne().sort({ decimals: -1 }).select('value').lean()
    return { isSuccess: true, pi: latestPiRecord.value, message }
  } catch (error) {
    console.error(`[returnLastPiRecord] Failed to get latest Pi record`, error)
    throw new Error(error)
  }
}

export const getPiRecord = async (request, reply) => {
  try {
    let increase = 1
    const hasDecimalQuery = !!(request.query && request.query.increase) && !!Number(request.query.increase)

    if (hasDecimalQuery) increase = Number(request.query.increase)

    const piGeneratorModuleUri: string = process.env.PI_GENERATOR_MODULE_URI + '/pi/generate'

    const response: any = await fetch(piGeneratorModuleUri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increase }),
    })

    const piGeneratorResponse: IPiGeneratorResponse = await response.json()

    return { isSuccess: true, pi: piGeneratorResponse.latestPiValue }
  } catch (error) {
    console.error(`[getPiRecord] Failed to get Pi record`, error)
    const message = `Pi Generator module is not responding. This is the latest generated record.`
    return getLastPiRecord(message)
  }
}
