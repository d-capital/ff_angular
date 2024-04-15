import { float } from "aws-sdk/clients/lightsail";

export class Results {
    constructor(
      public uid: string,
      public start_date: string,
      public end_date: string,
      public capital: float,
      public cap_change: float,
      public cap_currency: string,
      public max_drawdown: float,
      public max_win: float,
      public sr: float,
      public curve: string,
      public portfolio_id?: number,
      public portfolio_name?: string,
    ) { }
  }