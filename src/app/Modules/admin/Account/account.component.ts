import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{

  constructor(private acc: ApiService) {}
  
  userPic: any;
  user: any;

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;
    this.userPic = user.img

  }
  onFileChange(event: any): void {
    console.log('File change event:', event); // Log entire event
    const file = event.target.files[0];
    console.log('Selected file:', file); // Log selected file
  
    if (!file) {
      console.error('No file selected.');
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    console.log('User from localStorage:', user);
  
    if (!user.id) {
      console.error('User ID is missing in localStorage:', user);
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', user.id);
  
    console.log('FormData before upload:', formData);
  
    this.acc.uploadImage(formData).subscribe(response => {
      console.log('Upload response:', response);
      const newImageUrl = `http://localhost:8000/assets/userPic/${response['image_url'].split('/').pop()}`;
  
      this.userPic = newImageUrl;
      user.img = newImageUrl;
      localStorage.setItem('user', JSON.stringify(user));
  
      console.log('Updated user image:', newImageUrl);
      console.log('Updated localStorage user:', JSON.parse(localStorage.getItem('users') || '{}'));
  
      this.acc.updateUserPic(newImageUrl);
      console.log('User Picture URL:', this.userPic);
    }, error => {
      console.error('Error uploading image:', error);
    });
  }
  
  
}
