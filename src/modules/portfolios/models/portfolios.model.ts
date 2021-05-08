export class Portfolio {
    constructor(
      public saved_portfolio_id: number,
      public portfolio_name: string,
      public start_date?: Date,
      public end_date?: Date,
      public exchange?: string,
      public asset_group?: string,
      public capital?: number,
      public cap_currency?: string,
      public er?: number,
    ) { }
  }