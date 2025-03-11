import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule,EditorModule,],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  constructor(
    private formsservice: ApiService,
    private router: Router,
    private dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data from dialog
  ) {}
  ngOnInit(): void {
    if (this.data?.userid) {
      this.reqform.controls['userid'].setValue(this.data.userid);
      console.log('User ID:', this.data);
    } else {
      console.error('User ID is not available');
    }
  }

  isLoading: boolean = false; 
  reqform = new FormGroup({
    userid: new FormControl(''),
    description: new FormControl('Service Records'),
    file: new FormControl(''),
  });

  editorContent: string = '';

  postannouncement() {
    this.isLoading = true;
    if (this.reqform.valid) {
      this.formsservice.createFile(this.reqform.value).subscribe({
        next: (response) => {
          this.reqform.reset();
          this.dialogRef.close(true); 
        },
        error: (error) => {
          console.error('Error creating announcement', error);
        }
      });
    }
  }

  editorConfig: any = {
    plugins: [
     'image', 'link','markdown', 'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | insertfile',
    file_picker_types: 'file image',
    file_picker_callback: this.filePickerCallback.bind(this) // Reference function
  };

  filePickerCallback(callback: any, value: any, meta: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else {
      input.setAttribute('accept', '.pdf,.doc,.docx');
    }

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        callback(result.fileUrl, { text: file.name });
      } catch (error) {
        console.error('Upload failed', error);
      }
    };

    input.click();
  }
}
