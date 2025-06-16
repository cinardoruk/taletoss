import { Injectable } from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Observable, Observer } from 'rxjs';

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

  private aspNetUrl: string = 'http://localhost:5267/'
  private apiUrl: string = this.aspNetUrl + 'api/dice';
}
