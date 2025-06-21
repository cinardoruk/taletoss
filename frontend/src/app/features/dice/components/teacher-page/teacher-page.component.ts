import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog'

// my own components, services
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';

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
    UploadDialogComponent,
  ],
  templateUrl: './teacher-page.component.html',
  styleUrl: './teacher-page.component.css'
})
export class TeacherPageComponent {
  dice: TaleDie[] = [];
  newDie: Partial<TaleDie> = {};
  selectedDice: TaleDie[] = [];

  selectedFile: File | null = null;
  selectedFileName: string = '';

  selectedFiles: File[] | null = null;

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
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadDice();
    this.currentUrl = this.diceService.aspNetUrl;
  }

  reset(){
    this.newDie = {};
    this.selectedFile = null;
    this.selectedFileName = '';
    this.selectedFiles = null;
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

  addDie() {
    const observer = this.diceService.getObserver<TaleDie>(
      this.selectedFiles ? 'multi_create' : 'create',
      () => {
        this.reset();
        this.showSnackbar("Die(s) saved!", "Close");
      }
    );
    // if uploading multiple files
    if (this.selectedFiles !== null && this.selectedFiles.length > 0){
      const formData = new FormData();

      for (const file of this.selectedFiles){
        formData.append('files', file)
      }

      this.diceService.uploadMultiple(formData).subscribe(observer);
    }
    // if uploading a single file
    else if (this.selectedFile !== null){
      const formData = new FormData();
      formData.append('name', this.newDie.name || '');
      formData.append('svgFile', this.selectedFile);

      this.diceService.createDie(formData).subscribe(observer);
    }
  }

  updateDie(die: TaleDie) {
    const observer = this.diceService.getObserver<TaleDie>(
      'update',
      () => {
        this.reset();
        this.showSnackbar("Die updated", "Close");
      }
    );
    this.diceService.updateDie(die).subscribe(observer);
  }

  deleteDie(id: number) {
    const observer = this.diceService.getObserver<TaleDie>(
      'delete',
      () => {
        this.reset();
        this.showSnackbar("Die(s) deleted", "Close");
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

  onFileSelected(event: Event): void{
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length >0){
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onMultiFileSelected(event: Event): void{
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length >0){
      this.selectedFiles = Array.from(input.files);
    }
    else{
      this.selectedFiles = null;
    }
  }
  //dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent);

  }


}
