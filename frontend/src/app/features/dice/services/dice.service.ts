// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Injectable } from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Observable, Observer } from 'rxjs';

import { environment } from '@env/environment'

export interface TaleDie{
  id: number;
  name: string;
  svgPath: string;
  checked: boolean;
}

@Injectable({
  'providedIn': 'root'
})
export class DiceService {

  public aspNetUrl: string = environment.baseUrl;
  private apiUrl: string = environment.baseUrl + 'api/dice';

  constructor(private http: HttpClient) {}

  getDice(): Observable<TaleDie[]> {
    return this.http.get<TaleDie[]>(this.apiUrl);
  }

  createDie(formData: FormData): Observable<TaleDie> {
    return this.http.post<TaleDie>(this.apiUrl, formData);
  }

  uploadMultiple(formData: FormData): Observable<TaleDie> {
    return this.http.post<TaleDie>(this.apiUrl + '/upload-multiple', formData);
  }
  updateDie(die: TaleDie): Observable<TaleDie> {
    return this.http.put<TaleDie>(`${this.apiUrl}/${die.id}`, die);
  }
  deleteDie(id: number): Observable<TaleDie> {
    return this.http.delete<TaleDie>(`${this.apiUrl}/${id}`);
  }

  // since we don't have the snackbar here, we'll add two parameters
  // that take functions, and we'll pass e.g. the snackbar function
  // in the component
  getObserver<T>(
    action: 'multi_create' | 'create' | 'read' | 'update' | 'delete',
    onComplete?: (message: string) => void,
    onError?: (err:any) => void
  ): Partial<Observer<TaleDie>> {
    let message: string = '';

    switch (action) {
      case 'multi_create': message = "Items saved successfully."; break;
      case 'create': message = "Item saved successfully."; break;
      case 'update': message = "Item updated successfully."; break;
      case 'delete': message = "Item deleted successfully."; break;
      default: break;
    }

    return {
      "next": (response) => console.log('Success', response),
      "error": (err) => {
        console.error('Error!', err);
        onError?.(err);
      },
      "complete": () => {
        console.log('Request complete!');
        onComplete?.(message);
      }
    };
  }


}
