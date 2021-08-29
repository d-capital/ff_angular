import { float } from "aws-sdk/clients/lightsail";

export class PortfolioContent {
    constructor(
      public user_id:number,
      public portfolio_id: number,
      public asset: string,
      public lot: number,
      public to_buy: number,
      public percentage: float,
      public start_date?: Date,
      public end_date?: Date,
      public exchange?: string,
      public asset_group?: string,
      public capital?: number,
      public cap_currency?: string,
      public er?: number,
      public price?: float,
      public money?: float
    ) { }
  }