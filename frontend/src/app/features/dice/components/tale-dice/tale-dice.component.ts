import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface TaleDie{
  id: number;
  name: string;
  svgPath: string;
  checked: boolean;
}

@Component({
  selector: 'app-tale-dice',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './tale-dice.component.html',
  styleUrl: './tale-dice.component.css'
})
export class TaleDiceComponent implements OnInit {
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

  aspNetUrl: string = 'http://localhost:5267/'
  apiUrl: string = this.aspNetUrl + 'api/dice';

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadDice();
    this.currentUrl = this.aspNetUrl;
  }

  reset(){
    this.newDie = {};
    this.selectedFile = null;
    this.selectedFileName = '';
    this.selectedFiles = null;
    this.loadDice();
  }

  //CRUD

  private getObserver(action: 'multi_create' | 'create' | 'read' | 'update' | 'delete'): Partial<Observer<TaleDie>> {
    let message: string = '';

    switch (action) {
      case 'multi_create':
        message = "Items saved successfully."
        break;

      case 'create':
        message = "Item saved successfully."
        break;

      // case 'read':
      //   message = "Saved successfully."
      //   break;

      case 'update':
        message = "Item updated successfully."
        break;

      case 'delete':
        message = "Item deleted successfully."
        break;

      default:
        break;
    }

    return {
      "next": (response) => {
        console.log('Success', response);
      },
      "error": (err) => {
        console.error('Error!', err);
      },
      "complete": () => {
        console.log('Request complete!');
        this.reset();
        this.showSnackbar(message,"Close");
      }
    };
  }

  loadDice(){
    this.http.get<TaleDie[]>(this.apiUrl).subscribe(data => this.dice = data);
  }

  addDie() {
    // if uploading multiple files
    if (this.selectedFiles !== null && this.selectedFiles.length > 0){
      const formData = new FormData();

      for (const file of this.selectedFiles){
        formData.append('files', file)
      }

      this.http.post<TaleDie>(this.aspNetUrl + 'api/dice/upload-multiple', formData).subscribe(this.getObserver('multi_create'));
    }
    // if uploading a single file
    else if (this.selectedFile !== null){
      const formData = new FormData();
      formData.append('name', this.newDie.name || '');
      formData.append('svgFile', this.selectedFile);

      this.http.post<TaleDie>(this.apiUrl, formData).subscribe(this.getObserver('create'));
    }
  }

  updateDie(die: TaleDie) {
    this.http.put<TaleDie>(`${this.apiUrl}/${die.id}`, die).subscribe(this.getObserver('update'));
  }

  deleteDie(id: number) {
    this.http.delete<TaleDie>(`${this.apiUrl}/${id}`).subscribe(this.getObserver('delete'));
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

  //random dice

  shuffleDice(){
    this.selectedDice = TaleDiceComponent.getRandomSubarray(this.dice, 5);
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
