export const handleDecimal = (string: string, decimals: number) => {
  if (!string || decimals <= 1) return string

  const wholeNumberEndIndex = string.length - decimals + 1
  const wholeValue = string.substring(0, wholeNumberEndIndex)
  const decimalValue = string.slice(wholeNumberEndIndex)

  return wholeValue + '.' + decimalValue
}

export const getLastPiRecord = async (PiIteration: any): Promise<any> => {
  // Try to retrieve existing record and return it in case Pi generator failed
  try {
    const latestPiRecord = await PiIteration.findOne().sort({ decimals: -1 }).select('value').lean()
    const pi = handleDecimal(latestPiRecord.value, latestPiRecord.decimals)
    return { isSuccess: true, pi }
  } catch (error) {
    console.error(`[returnLastPiRecord] Failed to get latest Pi record`, error)
    throw new Error(error)
  }
}

export const computeCircumferenceOfSun = (piValue: string, piDecimals: number) => {
  try {
    const pi = BigInt(piValue)
    const radiusOfSun = BigInt(696340)

    const circumferenceOfSunRaw = BigInt(2) * (pi * radiusOfSun)
    const circumferenceOfSun = handleDecimal(circumferenceOfSunRaw.toString(), piDecimals)

    return circumferenceOfSun.toString()
  } catch (error) {
    console.error(`[computeCircumferenceOfSun] Failed to compute circumference of sun`, error)
    throw new Error(error)
  }
}
