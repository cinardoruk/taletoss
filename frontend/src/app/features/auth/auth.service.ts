// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { environment } from '@env/environment'
import { LoginRequest } from "./login-request";
import { LoginResult } from "./login-result";


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor (
    protected http: HttpClient
  )
  {}

  private tokenKey: string = "token";

  private _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable();

  isAuthenticated() : boolean {
    return this.getToken() !== null;
  }

  getToken() : string | null {
    return localStorage.getItem(this.tokenKey);
  }

  init() : void {
    if (this.isAuthenticated())
      this.setAuthStatus(true);
  }

  login(item: LoginRequest): Observable<LoginResult>{
    var url = environment.baseUrl + "api/account/login";
    return this.http.post<LoginResult>(url, item)
    .pipe(
      tap(
        loginResult => {
          if (loginResult.success && loginResult.token){
            localStorage.setItem(this.tokenKey, loginResult.token);
            this.setAuthStatus(true);
          }
        }
      )
    );
  }

  logout(){
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
  }

  private setAuthStatus(isAuthenticated: boolean): void {
    this._authStatus.next(isAuthenticated);
  }
}
