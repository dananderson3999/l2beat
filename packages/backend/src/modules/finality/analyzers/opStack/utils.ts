import { assert } from '@l2beat/backend-tools'
import { utils } from 'ethers'
import { DecompressionStream } from 'stream/web'

export async function getBatchFromChannel(channel: Uint8Array) {
  const decompressed = await decompressToByteArray(channel)
  const decoded = utils.RLP.decode(decompressed) as unknown

  // we assume decoded is a hex string, meaning it represents only one span batch
  assert(typeof decoded === 'string', 'Decoded is not a string')

  return byteArrFromHexStr(decoded)
}

async function decompressToByteArray(compressedData: Uint8Array) {
  const blob = new Blob([compressedData])
  const ds = new DecompressionStream('deflate')
  const stream = blob.stream().pipeThrough(ds)
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let totalSize = 0
  while (true) {
    try {
      const { done, value } = (await reader.read()) as {
        done: boolean
        value: Uint8Array
      }
      if (done) break
      chunks.push(value)
      totalSize += value.length
    } catch (err) {
      if (err instanceof Error && err.message === 'unexpected end of file')
        break
      throw err
    }
  }
  const concatenatedChunks = new Uint8Array(totalSize)
  let offset = 0
  for (const chunk of chunks) {
    concatenatedChunks.set(chunk, offset)
    offset += chunk.length
  }
  return concatenatedChunks
}

export function byteArrFromHexStr(hexString: string) {
  const str = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  const match = str.match(/.{1,2}/g)

  assert(match !== null, 'Invalid hex string')

  return Uint8Array.from(match.map((byte) => parseInt(byte, 16)))
}

export function hexStrFromByteArr(byteArr: Uint8Array) {
  return (
    '0x' +
    Array.from(byteArr)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  )
}