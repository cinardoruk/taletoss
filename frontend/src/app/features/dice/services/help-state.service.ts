// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})

export class HelpStateService {
  private showHelp = new BehaviorSubject<boolean>(true);
  showHelp$ = this.showHelp.asObservable();

  setShowHelp(value: boolean) {
    this.showHelp.next(value);
  }
}
