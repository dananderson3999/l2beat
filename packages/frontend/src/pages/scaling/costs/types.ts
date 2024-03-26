import {
  DataAvailabilityMode,
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
} from '../../../build/api/DELETE_THIS_FILE'
import { ValueWithDisplayValue } from '../../types'

export interface CostsPagesData {
  tvlApiResponse: TvlApiResponse
  costsApiResponse: L2CostsApiResponse
}

export interface ScalingCostsViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  dataAvailabilityMode: DataAvailabilityMode | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  costs: CostsData
}

export type CostsData = {
  [Timerange in keyof Omit<L2CostsApiProject, 'syncedUntil'>]: CostsDataDetails
}

export type CostsDataDetails = {
  total: CostsDataBreakdown
  calldata: CostsDataBreakdown
  blobs?: CostsDataBreakdown
  compute: CostsDataBreakdown
  overhead: CostsDataBreakdown
}

export type CostsDataBreakdown = {
  ethCost: ValueWithDisplayValue
  usdCost: ValueWithDisplayValue
  gas: ValueWithDisplayValue
}
