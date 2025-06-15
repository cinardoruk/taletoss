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

// primeNG
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
  ],
  providers: [MessageService],
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.css'
})

export class UploadDialogComponent {

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}

  onUpload(event:FileUploadEvent): void{
    for(let file of event.files){
      this.uploadedFiles.push(file);
    }
    console.log("upload!")
    this.messageService.add(
      {
        "severity": "info",
        "summary": "File Uploaded",
        "detail": ""
      }
    );
  }
}
