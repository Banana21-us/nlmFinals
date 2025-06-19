import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload,FileUploadEvent } from 'primeng/fileupload';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { start } from 'repl';
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

export interface Certificate {
  id: number;
  name: string;
  file: string;
  file_url: string;
  created_at: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,ToastModule,ButtonModule,RippleModule,DialogModule,InputTextModule,FileUpload,ConfirmDialog],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  providers: [MessageService,ConfirmationService],
  styles: [`
    :host ::ng-deep .p-toast {
      width: 335px; /* Adjust width as needed */
      font-size: 0.8rem; /* Adjust font size as needed */
      left: 50%;
      transform: translateX(-50%);
    }

    :host ::ng-deep .p-toast-message-content {
      padding: 0.75rem; /* Adjust padding as needed */
    }

    :host ::ng-deep .p-toast-summary {
      font-weight: bold;
    }
  `],
})
export class AccountComponent implements OnInit{
 @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
  constructor(private acc: ApiService,private fb: FormBuilder,private messageService: MessageService
  ,private confirmationService: ConfirmationService
  ) {}
    accountForm!: FormGroup;
    childrenForm!: FormGroup;
    userPic: any;
    user: any;
    id: any;
    userId: any;
    accountData: any;
    accountDetails: any;
    isEditing = false;
    Editing = true;
    personal = false;
    name = '';
    total_years_of_service:any;
    selectedFile: File | null = null; // To hold the selected file for upload
    certificates: Certificate[] = [];
    toggleEditMode(editMode: boolean) {
      this.isEditing = editMode;
      this.Editing = !editMode;
    }
    cancelChanges() {
      // Your cancel logic here (e.g., reset form, hide edit mode)
      this.toggleEditMode(false); // Disable edit mode
    }
    
    ngOnInit(): void {
        this.initializeForms();
        this.loadUserData();
        this.loadAccountDetails();
        this.getUserFromLocalStorage();
        this.loadCertificates();
    }
    loadCertificates(): void {
    // Get user ID from localStorage
    const userData = localStorage.getItem('users');
    if (!userData) {
      return;
    }
    const userId = JSON.parse(userData).id;
    
    this.acc.getCertificatesByUserId(userId).subscribe({
      next: (data:any) => {
        this.certificates = data.data;
        
        console.log('Certificates loaded:', this.certificates);
      },
      error: (err) => {
        console.error(err);
      }
    });
    }
    
    deleteCertificate(id: number): void {
      this.confirmationService.confirm({
        header: 'Are you sure?',
        message: 'Do you really want to delete this certificate?',
        accept: () => {
          this.acc.deleteCertificate(id).subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Certificate deleted successfully',
                life: 3000
              });
              this.loadCertificates(); // Refresh the list after deletion
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete certificate'
              });
            }
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Certificate deletion cancelled'
          });
        }
      });
    }
    initializeForms(): void {
        this.accountForm = this.fb.group({
            name: ['', Validators.required],
            phone_number: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: [''],
            status: ['', Validators.required],
            birthplace: [''],
            education: this.fb.array([]),
            spouse: [''],
            dateofmarriage: [''],
            employments: this.fb.array([]),
            yearsofservice: this.fb.array([]),
            old_password: [''],  // Old password field
            new_password: ['', [Validators.minLength(8)]],  // New password field
            confirm_password: ['']  // Confirm password field
        }, {
            validators: this.passwordMatchValidator
        });

        this.childrenForm = this.fb.group({
            children: this.fb.array([])
        });
    }
    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('new_password')?.value;
        const confirmPassword = form.get('confirm_password')?.value;
        if (newPassword !== confirmPassword) {
            form.get('confirm_password')?.setErrors({ mismatch: true });
            return { mismatch: true };
        }
        return null;
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
            status: this.accountData?.status || '', // Use accountData.status
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

        // Patch yearsofservice
        this.clearFormArray(this.yearsofservice);
        if (this.accountData?.yearsofservice?.length) {
            this.accountData.yearsofservice.forEach((service: any) => {
                this.addYearsOfService(service);
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

    // yearsofservice
   get yearsofservice(): FormArray {
      return this.accountForm.get('yearsofservice') as FormArray;
    }

    createYearsOfServiceFormGroup(service?: any): FormGroup {
      return this.fb.group({
        organization: [service?.organization || '', Validators.required],
        start_date: [service?.start_date || '', Validators.required],
        end_date: [service?.end_date ?? null]
      });
    }

    addYearsOfService(service?: any): void {
      this.yearsofservice.push(this.createYearsOfServiceFormGroup(service));
    }

    removeYearsOfService(index: number): void {
      this.yearsofservice.removeAt(index);
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
          this.loadUserData();
          this.loadAccountDetails();
      }, error => {
          console.error('Error uploading image:', error);
      });
  }
  
  
  
  onSubmit(): void {
    // Clear password validators if not needed
    this.accountForm.get('old_password')?.clearValidators();
    this.accountForm.get('old_password')?.updateValueAndValidity();
    this.accountForm.get('new_password')?.clearValidators();
    this.accountForm.get('new_password')?.updateValueAndValidity();
    this.accountForm.get('confirm_password')?.clearValidators();
    this.accountForm.get('confirm_password')?.updateValueAndValidity();
    

    if (this.accountForm.valid && this.childrenForm.valid) {
        const accountData = this.accountForm.value;
        const childrenData = this.childrenForm.value;
        const userId = localStorage.getItem('user');

        if (!userId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        const allData = {
            userid: userId,
            ...accountData,
            children: childrenData.children
        };

        console.log('All data to submit:', allData);

        this.acc.saveAccountData(allData).subscribe(
            (response) => {
                console.log('Data saved successfully:', response);
                localStorage.setItem('users', JSON.stringify(allData));
                this.showBottomRight();
                this.loadUserData();
                this.loadAccountDetails();
            },
            (error) => {
                console.error('Error saving data:', error);
            }
        );
        this.toggleEditMode(false);
    } else {
        this.accountForm.markAllAsTouched();
        this.childrenForm.markAllAsTouched();
        console.log('Form is invalid. Check the errors.');
    }
}


    showBottomRight() {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Account updated successfully', key: 'br', life: 3000 });
    }   
    getUserFromLocalStorage() {
        const userData = localStorage.getItem('users');
        if (userData) {
            const user = JSON.parse(userData);
            this.userId = user.id; // Assuming your user object has an 'id' field
        }
    }

    openCertificate() {
    this.name = '';
    this.selectedFile = null;
    this.personal = true;
    }
    onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (this.selectedFile && !validTypes.includes(this.selectedFile.type)) {
        this.selectedFile = null;
        return;
      }
      
      // Validate file size (5MB max)
      if (this.selectedFile && this.selectedFile.size > 5 * 1024 * 1024) {
        this.selectedFile = null;
        return;
      }
    }
  }
     submitCertificate() {
    // Validate all fields
    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not identified'
      });
      return;
    }

    if (!this.name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a certificate name'
      });
      return;
    }
    if (!this.selectedFile) {
      console.log('Please select a valid file');
      return;
    }
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a file'
      });
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.name);
    formData.append('userid', this.userId);

    // Submit
    this.acc.postcertificate(formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Certificate uploaded successfully'
        });
        this.resetForm();
        
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Upload failed'
        });
      }
    });
     this.loadCertificates();
  }

  resetForm() {
    this.name = '';
    this.selectedFile = null;
    this.personal = false;

    if (this.fileUploadRef) {
      this.fileUploadRef.clear(); // This is PrimeNG's method to clear files
      this.fileUploadRef.files = []; // Force clear the files array
    }
  }
}

