import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { ApiService } from '../../../../api.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-update',
  imports: [CommonModule, ReactiveFormsModule,MatError,EditorModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {

  constructor (private announcementservice: ApiService,
               private router: Router, 
               private dialogRef: MatDialogRef<UpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  isLoading: boolean = false; 
  announcementform = new FormGroup({
    title: new FormControl(''),
    announcement: new FormControl(''),
  });

  editorContent: string = '';

  ngOnInit(): void {
    if (this.data.ann) {
      this.announcementform.patchValue({
        title: this.data.ann.title,
        announcement: this.data.ann.announcement
      });
    }
  }

  update() {
    if (this.announcementform.valid) {
      this.announcementservice.updateAnnouncement(this.data.ann.id, this.announcementform.value).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating leave:', error);
        }
      });
    }
  }

  editorConfig: any = {
    plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
      'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste',
      'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography',
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
