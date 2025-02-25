import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../api.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{

  constructor(private acc: ApiService,private fb: FormBuilder) {}
    accountForm!: FormGroup;
    childrenForm!: FormGroup;
    userPic: any;
    user: any;
    id: any;
    accountData: any;
    

    ngOnInit(): void {
        this.initializeForms();
        this.loadUserData();
        this.loadAccountDetails();
    }

    initializeForms(): void {
        this.accountForm = this.fb.group({
            name: ['', Validators.required],
            phone_number: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: [''],
            birthdate: [''],
            birthplace: [''],
            education: this.fb.array([]),
            spouse: [''],
            dateofmarriage: [''],
            employments: this.fb.array([])
        });

        this.childrenForm = this.fb.group({
            children: this.fb.array([])
        });
    }

    loadUserData(): void {
      try {
          const userString = localStorage.getItem('users');
  
          if (userString) {
              this.user = JSON.parse(userString);
              
              // Ensure image URL is properly set
              if (this.user.img && !this.user.img.startsWith('http')) {
                  this.user.img = `http://localhost:8000/assets/userPic/${this.user.img}`;
              }
          } else {
              this.user = {};
              console.warn('No user data found in localStorage.');
          }
  
          this.userPic = this.user.img || 'default-profile.png';
  
      } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          this.user = {};
          this.userPic = 'default-profile.png';
      }
  }
  

    loadAccountDetails(): void {
        const id = localStorage.getItem('user');
        this.id = id;
        this.acc.getAccountDetails(this.id).subscribe({
            next: (response) => {
                this.accountData = response.data; // Access the 'data' property
                console.log('Account Details:', this.accountData);
                this.patchForms();
            },
            error: (error) => {
                console.error('Error fetching account details:', error);
            }
        });
    }

    patchForms(): void {
        // Patch base user details in accountForm
        this.accountForm.patchValue({
            name: this.accountData?.name || '', // Use accountData.name
            phone_number: this.accountData?.phone_number || '', // Use accountData.phone_number
            email: this.accountData?.email || '',// Use accountData.email
            address: this.accountData?.address || '', // Use accountData.address
            birthdate: this.accountData?.birthdate || '', // Use accountData.birthdate
            birthplace: this.accountData?.birthplace || '',// Use accountData.birthplace
            spouse: this.accountData?.spouse?.name || '',
            dateofmarriage: this.accountData?.spouse?.dateofmarriage || ''
        });

        // Patch education
        this.clearFormArray(this.education);
        if (this.accountData?.education?.length) {
            this.accountData.education.forEach((edu: any) => {
                this.addEducation(edu);
            });
        }

        // Patch children - important: clear and rebuild the children form array
        this.clearFormArray(this.children);
        if (this.accountData?.children?.length) {
            this.accountData.children.forEach((child: any) => {
                this.addChild(child);
            });
        }

        // Patch employment
        this.clearFormArray(this.employments);
        if (this.accountData?.employments?.length) {
            this.accountData.employments.forEach((employment: any) => {
                this.addEmployment(employment);
            });
        }
    }

    // Helper function to clear a FormArray
    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    // Education FormArray
    get education(): FormArray {
        return this.accountForm.get('education') as FormArray;
    }

    createEducationFormGroup(education?: any): FormGroup {
        return this.fb.group({
            level: [education?.level || ''],
            year: [education?.year || ''],
            school: [education?.school || ''],
            degree: [education?.degree || '']
        });
    }

    addEducation(education?: any): void {
        this.education.push(this.createEducationFormGroup(education));
    }

    removeEducation(index: number): void {
        this.education.removeAt(index);
    }

    // Children FormArray
    get children(): FormArray {
        return this.childrenForm.get('children') as FormArray;
    }

    createChildFormGroup(child?: any): FormGroup {
        return this.fb.group({
            name: [child?.name || '', Validators.required],
            career: [child?.career || ''],
            dateofbirth: [child?.dateofbirth || '', Validators.required]
        });
    }

    addChild(child?: any): void {
        this.children.push(this.createChildFormGroup(child));
    }

    removeChild(index: number): void {
        this.children.removeAt(index);
    }

    // Employment FormArray
    get employments(): FormArray {
        return this.accountForm.get('employments') as FormArray;
    }

    createEmploymentFormGroup(employment?: any): FormGroup {
        return this.fb.group({
            position: [employment?.position || '', Validators.required],
            dateofemp: [employment?.dateofemp || ''], //dateofemp
            organization: [employment?.organization || '']
        });
    }

    addEmployment(employment?: any): void {
        this.employments.push(this.createEmploymentFormGroup(employment));
    }

    removeEmployment(index: number): void {
        this.employments.removeAt(index);
    }

  
    onFileChange(event: any): void {
      const file = event.target.files[0];
    
      if (!file) {
          console.error('No file selected.');
          return;
      }
    
      const user = JSON.parse(localStorage.getItem('users') || '{}');
    
      if (!user.id) {
          console.error('User ID is missing in localStorage:', user);
          return;
      }
    
      const formData = new FormData();
      formData.append('image', file);
    
      // Include additional user information if needed
      formData.append('id', user.id); // Use userid from parsed object
    
      // Log FormData for debugging
      console.log('FormData before upload:', formData);
    
      // Proceed with image upload
      this.acc.uploadImage(formData).subscribe(response => {
          const newImageUrl = `http://localhost:8000/assets/userPic/${response['image_url'].split('/').pop()}`;
          // Update localStorage or perform other actions as needed
          console.log('Upload response:', response);
          
          // Update user's image URL in localStorage if necessary
          user.img = newImageUrl; 
          localStorage.setItem('users', JSON.stringify(user));
          
          console.log('Updated localStorage user:', JSON.parse(localStorage.getItem('users') || '{}'));
          
          // Additional logic to handle the updated profile picture
          this.acc.updateUserPic(newImageUrl);
          console.log('User Picture URL:', newImageUrl);
          
      }, error => {
          console.error('Error uploading image:', error);
      });
  }
  
  
  
  onSubmit(): void {
    if (this.accountForm.valid && this.childrenForm.valid) {
        const accountData = this.accountForm.value;
        const childrenData = this.childrenForm.value;
        const userId = localStorage.getItem('user');

        if (!userId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        const allData = {
            userid: userId, // Ensure user ID is included
            ...accountData,
            children: childrenData.children
        };

        console.log('All data to submit:', allData);

        this.acc.saveAccountData(allData).subscribe(
            (response) => {
                console.log('Data saved successfully:', response);
                localStorage.setItem('users', JSON.stringify(allData));
            },
            (error) => {
                console.error('Error saving data:', error);
            }
        );
    } else {
        this.accountForm.markAllAsTouched();
        this.childrenForm.markAllAsTouched();
        console.log('Form is invalid. Check the errors.');
    }
}

  
}
