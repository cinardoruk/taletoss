import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

//angular material
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// primeNG
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// service, interface for my model
import { DiceService, TaleDie } from '../../services/dice.service';

@Component({
  selector: 'app-upload-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ToastModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSnackBarModule,
  ],
  providers: [MessageService],
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.css'
})

export class UploadDialogComponent {

  selectedFiles: File[] | null = null;

  constructor(
    private messageService: MessageService,
    private diceService: DiceService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<UploadDialogComponent>
  ) {}

  onFileSelect(event: { files: File[]}){
    this.selectedFiles = event.files;
  }

  onClear(){
    this.selectedFiles = [];
  }


  addDie() {
    if (this.selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of this.selectedFiles){
      formData.append('files', file);
    }

    const observer = this.diceService.getObserver<TaleDie>(
      'multi_create',
      () => {
        this.snackbar.open("Die(s) uploaded!", "Close", {"duartion":2000});
        this.dialogRef.close('uploaded');
      }
    );

    this.diceService.uploadMultiple(formData).subscribe(observer);





    // delete below
    // const observer = this.diceService.getObserver<TaleDie>(
    //   this.selectedFiles ? 'multi_create' : 'create',
    //   () => {
    //     // this.reset();
    //     // this.showSnackbar("Die(s) saved!", "Close");
    //   }
    // );
    // // if uploading multiple files
    // if (this.selectedFiles !== null && this.selectedFiles.length > 0){
    //   const formData = new FormData();

    //   for (const file of this.selectedFiles){
    //     formData.append('files', file)
    //   }

    //   this.diceService.uploadMultiple(formData).subscribe(observer);
    // }
    // // if uploading a single file
    // else if (this.selectedFile !== null){
    //   const formData = new FormData();
    //   formData.append('name', this.newDie.name || '');
    //   formData.append('svgFile', this.selectedFile);

    //   this.diceService.createDie(formData).subscribe(observer);
    // }
  }

  // onUpload(event:FileUploadEvent): void{
  //   for(let file of event.files){
  //     this.uploadedFiles.push(file);
  //   }
  //   console.log("upload!")
  //   this.messageService.add(
  //     {
  //       "severity": "info",
  //       "summary": "File Uploaded",
  //       "detail": ""
  //     }
  //   );
  // }
}
