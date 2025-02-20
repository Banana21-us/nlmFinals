import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../api.service';
@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule,MatError,EditorModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
})
export class CreateComponent {
  constructor (private announcementservice: ApiService,
               private router: Router, 
               private dialogRef: MatDialogRef<CreateComponent>) {}

  isLoading: boolean = false; 
  announcementform = new FormGroup({
    title: new FormControl(''),
    announcement: new FormControl(''),
  });

  editorContent: string = '';

  postannouncement() {
    this.isLoading = true;
    if (this.announcementform.valid) {
      this.announcementservice.createAnnouncement(this.announcementform.value).subscribe({
        next: (response) => {
          this.announcementform.reset();
          this.isLoading = false;
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
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
      'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste',
      'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'typography',
      'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | insertfile',
    file_picker_types: 'file',
    file_picker_callback: this.filePickerCallback.bind(this) // Reference function
  };
  

  filePickerCallback(callback: any, value: any, meta: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.pdf,.doc,.docx');

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
