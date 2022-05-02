import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';
import { Portfolio } from './portfolios.model';
import { PortfolioContent } from 'src/app/models/portfolio-content';
import { DbAssets } from 'src/app/models/dbassets';
import { integer } from 'aws-sdk/clients/lightsail';




@Injectable()
export class PortfoliosApiService {
private portfoliosUrl = `${API_URL}/manage_portfolios`;
private deletePortfoliosUrl = `${API_URL}/api/delete_portfolio`;
private renamePortfoliosUrl = `${API_URL}/api/rename_portfolio`;
private getPortfolioContentUrl = `${API_URL}/api/get_single_portfolio_content`;
private getPortfolioInfoUrl = `${API_URL}/api/get_single_portfolio_info`;
private getAssetsUrl = `${API_URL}/api/get_assets`;
private getAssetMatchesUrl = `${API_URL}/api/get_asset_matches`;
private savePortfolioUrl = `${API_URL}/api/save_portfolio`;
private startBacktestUrl = `${API_URL}/api/start_backtest`;
private getPortfoliosCountUrl = `${API_URL}/api/get_portfolios_count`;

  constructor(private http: HttpClient) {
    
  }

  // GET list of portfolios
  getPortfolios(token: any): Observable<Portfolio[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Portfolio[]>(this.portfoliosUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  getPortfoliosCount(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(this.getPortfoliosCountUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  deletePortfolio(token:any, portfolio_id: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = { portfolio_id: portfolio_id};
    return this.http.post(this.deletePortfoliosUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  renamePortfolio(
    token:any, 
    portfolio_id: string, 
    new_name: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = { 
      portfolio_id: portfolio_id,
      new_name: new_name
    };
    return this.http.post(this.renamePortfoliosUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  public getPortfolioContent(
    token: any,
    portfolio_id: number,
    isTempPortfolio : string
    ): Observable<PortfolioContent[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    const body = { 
      portfolio_id: portfolio_id,
      isTempPortfolio: isTempPortfolio
    };
    return this.http.post<PortfolioContent[]>(this.getPortfolioContentUrl, 
      JSON.stringify(body), 
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  public getPortfolioInfo(
    token: any,
    portfolio_id: number
    ): Observable<Portfolio> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    const body = { 
      portfolio_id: portfolio_id,
    };
    return this.http.post<Portfolio>(this.getPortfolioInfoUrl, 
      JSON.stringify(body), 
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  public getAssets(assetsToLookup?: PortfolioContent[]): Observable<DbAssets[]> {
    const body = {assets_to_lookup: assetsToLookup}
    return this.http.post<DbAssets[]>(this.getAssetsUrl, JSON.stringify(body)).pipe(catchError(this.erroHandler));
  }
  public getAssetMatches(lookupValue:string): Observable<DbAssets[]>{
    const body = {
      lookup_value: lookupValue
    };
    return this.http.post<DbAssets[]>(this.getAssetMatchesUrl,
      JSON.stringify(body)).pipe(catchError(this.erroHandler));
  }
  public savePortfolio(token:any, new_name: string, portfolio_id: string, portfolioToSave: PortfolioContent[]): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = {new_name: new_name,portfolio_id: portfolio_id, portfolioUpdates: portfolioToSave};
    return this.http.post(this.savePortfolioUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  public startBacktest(token:any, stocksForTest: any, allocationForTest: any,capital: integer, capCurrency: string, backtestStartDate: string, backtestEndDate: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = {capital: capital, stocksForTest: stocksForTest, allocationForTest: allocationForTest, capCurrency: capCurrency, backtestStartDate: backtestStartDate, backtestEndDate: backtestEndDate};
    return this.http.post(this.startBacktestUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}