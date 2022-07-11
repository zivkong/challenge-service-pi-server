import mongoose from 'mongoose'
import fetch from 'cross-fetch'

import { PiIterationSchema } from './schemas/PiIteration.schema'

import { IPiGeneratorResponse } from './interfaces'
import { handleDecimal, getLastPiRecord, computeCircumferenceOfSun } from './functions'

const db = mongoose.createConnection(process.env.READ_DB_CONN)
const PiIteration = db.model('PiIteration', PiIterationSchema)

const generatePiRecord = async (increase: number): Promise<IPiGeneratorResponse> => {
  try {
    const piGeneratorModuleUri: string = process.env.PI_GENERATOR_MODULE_URI + '/pi/generate'

    const response: any = await fetch(piGeneratorModuleUri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increase }),
    })

    const piGeneratorResponse: IPiGeneratorResponse = await response.json()
    return piGeneratorResponse
  } catch (error) {
    console.error(`[generatePiRecord] Failed to generate Pi record`, error)
    return getLastPiRecord(PiIteration)
  }
}

export const healthCheck = (request, reply) => {
  reply.send({ status: 'OK' })
}

export const getPiRecord = async (request, reply) => {
  try {
    let increase = 1
    const hasDecimalQuery = !!(request.query && request.query.increase) && !!Number(request.query.increase)

    if (hasDecimalQuery) increase = Number(request.query.increase)

    const piGeneratorResponse = await generatePiRecord(increase)

    const pi = handleDecimal(piGeneratorResponse.pi, piGeneratorResponse.decimals)
    return { isSuccess: true, pi }
  } catch (error) {
    console.error(`[getPiRecord] Failed to get Pi record`, error)
  }
}

export const getSunCircumference = async (request, reply) => {
  try {
    await generatePiRecord(1)

    const existingPiRecord = await PiIteration.findOne().sort({ decimals: -1 }).lean()

    const piString = existingPiRecord.value
    const piDecimals = existingPiRecord.decimals

    const pi = handleDecimal(piString, piDecimals)
    const circumferenceOfSunKM = computeCircumferenceOfSun(piString, piDecimals)

    return { isSuccess: true, pi, circumferenceOfSunKM }
  } catch (error) {
    console.error(`[getSunCircumference] Failed to get sun circumference`, error)
    throw new Error(error)
  }
}
