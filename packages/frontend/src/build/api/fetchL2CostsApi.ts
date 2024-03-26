import { UnixTime } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
  L2CostsDetails,
} from './DELETE_THIS_FILE'

export async function fetchL2CostsApi(): Promise<L2CostsApiResponse> {
  return Promise.resolve(getMockL2CostsApiResponse())
}

function getMockL2CostsApiResponse(): L2CostsApiResponse {
  const projects = [
    'zksyncera',
    'base',
    'optimism',
    'honeypot',
    'fuelv1',
    'kroma',
    'mode',
    'zksync2',
    'zora',
  ].reduce<Record<string, L2CostsApiProject>>((acc, cur) => {
    const withoutBlobs = cur === 'honeypot' || cur === 'kroma'
    acc[cur] = generateMockData(withoutBlobs)
    return acc
  }, {})

  return {
    projects,
  }
}

function generateMockData(withoutBlobs?: boolean): L2CostsApiProject {
  return {
    syncedUntil: UnixTime.now(),
    last24h: generateMockDataDetails(2, withoutBlobs),
    last7d: generateMockDataDetails(8, withoutBlobs),
    last30d: generateMockDataDetails(30, withoutBlobs),
    last90d: generateMockDataDetails(90, withoutBlobs),
  }
}

function generateMockDataDetails(
  base: number,
  withoutBlobs?: boolean,
): L2CostsDetails {
  const calldataMultiplier = Math.random()
  const blobsMultiplier = Math.random()
  const computeMultiplier = Math.random()
  const overheadMultiplier = Math.random()

  const usdMultiplier = base * 3500
  const gasMultiplier = base * 100000

  const calldataEthCost = round(base * calldataMultiplier)
  const calldataUsdCost = round(base * usdMultiplier * calldataMultiplier)
  const calldataGas = round(base * gasMultiplier * calldataMultiplier)
  const blobEthCost = round(base * blobsMultiplier)
  const blobUsdCost = round(base * usdMultiplier * blobsMultiplier)
  const blobGas = round(base * gasMultiplier * blobsMultiplier)
  const computeEthCost = round(base * computeMultiplier)
  const computeUsdCost = round(base * usdMultiplier * computeMultiplier)
  const computeGas = round(base * gasMultiplier * computeMultiplier)
  const overheadEthCost = round(base * overheadMultiplier)
  const overheadUsdCost = round(base * usdMultiplier * overheadMultiplier)
  const overheadGas = round(base * gasMultiplier * overheadMultiplier)

  const totalEthCost = round(
    withoutBlobs
      ? calldataEthCost + computeEthCost + overheadEthCost
      : calldataEthCost + blobEthCost + computeEthCost + overheadEthCost,
  )
  const totalUsdCost = round(
    withoutBlobs
      ? calldataUsdCost + computeUsdCost + overheadUsdCost
      : calldataUsdCost + blobUsdCost + computeUsdCost + overheadUsdCost,
  )
  const totalGas = round(
    withoutBlobs
      ? calldataGas + computeGas + overheadGas
      : calldataGas + blobGas + computeGas + overheadGas,
  )
  return {
    total: {
      ethCost: totalEthCost,
      usdCost: totalUsdCost,
      gas: totalGas,
    },
    calldata: {
      ethCost: calldataEthCost,
      usdCost: calldataUsdCost,
      gas: calldataGas,
    },
    blobs: withoutBlobs
      ? undefined
      : {
          ethCost: blobEthCost,
          usdCost: blobUsdCost,
          gas: blobGas,
        },
    compute: {
      ethCost: computeEthCost,
      usdCost: computeUsdCost,
      gas: computeGas,
    },
    overhead: {
      ethCost: overheadEthCost,
      usdCost: overheadUsdCost,
      gas: overheadGas,
    },
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
