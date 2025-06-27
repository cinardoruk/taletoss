import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

// service and interface for Die
import { DiceService, TaleDie } from '@features/dice/services/dice.service';

import { HelpStateService } from '@features/dice/services/help-state.service'

import { environment } from '@env/environment'

@Component({
  selector: 'app-tale-dice',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatDividerModule,
  ],
  templateUrl: './tale-dice.component.html',
  styleUrl: './tale-dice.component.css'
})

export class TaleDiceComponent implements OnInit {

  five_button: string = "assets/5_die.svg";
  nine_button: string = "assets/9_die.svg";
  rotate5: boolean = false;
  rotate9: boolean = false;

  showHelpMessage: boolean = true;

  dice: TaleDie[] = [];
  selectedDice: (TaleDie | null)[] = [];
  diceQty: number = 5;

  currentUrl: string = environment.baseUrl;

  constructor(
    private diceService: DiceService,
    private helpState: HelpStateService,
  ) {}

  ngOnInit(): void {
    this.loadDice();
    this.currentUrl = this.diceService.aspNetUrl;
    this.helpState.showHelp$.subscribe(help => {
      this.showHelpMessage = help;
    });
  }

  loadDice(){
    this.diceService.getDice().subscribe(data => this.dice = data);
  }

  triggerRotate5() {
    this.rotate5 = true;

    // remove class after some time
    setTimeout(() => {
      this.rotate5=false;
    }, 500);
  }

  triggerRotate9() {
    this.rotate9 = true;

    // remove class after some time
    setTimeout(() => {
      this.rotate9=false;
    }, 500);
  }

  // Fill grid with 9 slots; insert die or null in desired positions
  getGridWithPlusShape(): (TaleDie | null)[] {
    const plusIndices = [1, 3, 4, 5, 7]; // center row & column
    const filled = Array(9).fill(null);

    this.selectedDice.slice(0, 5).forEach((die, i) => {
      filled[plusIndices[i]] = die;
    });

    return filled;
  }

  //random dice
  shuffleDice(){
    this.selectedDice = TaleDiceComponent.getRandomSubarray(this.dice, this.diceQty);
    if (this.diceQty === 5)
      {
        this.selectedDice = this.getGridWithPlusShape();
      }
    this.helpState.setShowHelp(false);
  }

  static getRandomSubarray<T>(arr: T[], size: number): T[] {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }
}
