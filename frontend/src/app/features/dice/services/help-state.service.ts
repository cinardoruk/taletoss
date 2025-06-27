
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
