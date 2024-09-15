import { ProviderBet } from "@/enums"

export interface BetModel {
  provider: ProviderBet
  value: string
  type?: number
  maps?: BetModel[]
}