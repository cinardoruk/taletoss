import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatIconModule } from '@angular/material/icon';

// service and interface for Die
import { DiceService, TaleDie } from '../../services/dice.service';

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
  ],
  templateUrl: './tale-dice.component.html',
  styleUrl: './tale-dice.component.css'
})

export class TaleDiceComponent implements OnInit {

  five_button: string = "/assets/5_die.svg";
  nine_button: string = "/assets/9_die.svg";

  dice: TaleDie[] = [];
  selectedDice: (TaleDie | null)[] = [];
  diceQty: number = 5;

  currentUrl: string = '';

  constructor(
    private diceService: DiceService,
  ) {}

  ngOnInit(): void {
    this.loadDice();
    this.currentUrl = this.diceService.aspNetUrl;
  }

  loadDice(){
    this.diceService.getDice().subscribe(data => this.dice = data);
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
