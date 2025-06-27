// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// my own components, services
import { DiceService, TaleDie } from '../../services/dice.service';


@Component({
  selector: 'app-teacher-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  templateUrl: './teacher-page.component.html',
  styleUrl: './teacher-page.component.css'
})
export class TeacherPageComponent {
  dice: TaleDie[] = [];
  newDie: Partial<TaleDie> = {};
  selectedDice: TaleDie[] = [];

  selectedFiles: File[] | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentUrl: string = '';

  displayedColumns: string[] =[
    'selected',
    'icon',
    'name',
    'svgPath',
    // 'actions',
  ];

  constructor(
    private diceService: DiceService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadDice();
    this.currentUrl = this.diceService.aspNetUrl;
  }

  reset(){
    this.newDie = {};
    this.selectedFiles = null;

    this.dice.forEach(die => die.checked = false);

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    this.loadDice();
  }

  anyDiceChecked(): boolean{
    return this.dice.some(die => die.checked)
  }

  showSnackbar(message: string, action: string){
    this.snackbar.open(message, action, {
      "duration" : 3000,
    });
  }

  //CRUD

  loadDice(){
    this.diceService.getDice().subscribe(data => this.dice = data);
  }

  addDice() {

    if (this.selectedFiles === null) return;

    const formData = new FormData();
    for (const file of this.selectedFiles){
      formData.append('files', file);
    }

    const observer = this.diceService.getObserver<TaleDie>(
      'multi_create',
      () => {
        this.snackbar.open("Dice uploaded!", "Close", {"duration":2000});
        this.reset();
      },
      (err) => {
        console.error("Upload failed:", err);
        this.snackbar.open("Dice upload error!", "Close", {"duration": 2000});
      }
    );

    this.diceService.uploadMultiple(formData).subscribe(observer);
  }

  deleteDie(id: number) {
    const observer = this.diceService.getObserver<TaleDie>(
      'delete',
      () => {
        this.reset();
        this.showSnackbar("Dice deleted", "Close");
      }
    );
    this.diceService.deleteDie(id).subscribe(observer);
  }

  deleteSelectedDice(){
    for (const die of this.dice){
      if (die.checked){
        this.deleteDie(die.id);
      }
    }
  }

  //file selection

  onMultiFileSelected(event: Event): void{
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length >0){
      this.selectedFiles = Array.from(input.files);
      this.addDice();
    }
    else{
      this.selectedFiles = null;
      this.showSnackbar("No files selected.", "Close")
    }
  }

}
