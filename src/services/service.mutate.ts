import mongoose from 'mongoose'

import { PiIterationSchema } from './schemas/PiIteration.schema'

const db = mongoose.createConnection(process.env.WRITE_DB_CONN)
const PiIteration = db.model('PiIteration', PiIterationSchema)

export const resetPiRecords = async (request, reply) => {
  try {
    const deletedPis = await PiIteration.deleteMany()
    reply.send({ isSuccess: true, message: 'All Pi records has been deleted', data: deletedPis })
  } catch (error) {
    console.error(`[resetPiRecords] Failed to reset Pi records`, error)
    throw new Error(error)
  }
}
