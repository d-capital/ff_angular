import { float } from "aws-sdk/clients/lightsail";

export class OptimizationInputs {
    constructor(
        public capital: number,
        public cap_currency: string,
        public exchange: string,
        public asset_group: string,
        public use_custom_period: boolean,
        public save_result: boolean,
        public opt_method?: string,
        public forecast_method?: string,
        public start_date?: string,
        public end_date?: string,
    ) { }
  }