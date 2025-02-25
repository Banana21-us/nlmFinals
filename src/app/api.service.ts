import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api/'; // Laravel API URL
  token: string | null = null;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token'); // Access localStorage only in the browser
    }
  }

  private userPicSubject = new BehaviorSubject<string | null>(null); // Store user image URL
  userPic$ = this.userPicSubject.asObservable();


  // constructor(private http: HttpClient) {}
  // token = localStorage.getItem('token');
  // Fetch users from Laravel API
  login(data:any){
    return this.http.post(this.apiUrl + 'login',data);
  }
  logout(): Observable<any> {
    const headers = {'Authorization': 'Bearer ' + this.token};
    return this.http.post(this.apiUrl + 'logout', {}, { headers });
  }
  getCounts(): Observable<{ total_users: number; total_announcements: number }> {
    return this.http.get<{ total_users: number; total_announcements: number }>(this.apiUrl  + 'users/count');
  }
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8000/api/upload-image', formData);
  }
  
  updateUserPic(newImageUrl: string) {
    this.userPicSubject.next(newImageUrl); // Emit new image URL
  }

  // emp
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}users`);
  }
  postusers(userData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'regusers',userData)
  }
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'employees');
  }
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}employees/${id}`);
  }
  updateemp(id: number, emp: any) {
    return this.http.put(`${this.apiUrl}employees/${id}`, emp);
  }
  getEmployee(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}employees/${id}`);
  }
  acceptemployee(id: number, emp: any) {
    return this.http.put(`${this.apiUrl}acceptemployees/${id}`, emp);
  }

  // leave
  createLeaveType(leaveData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'leave-types',leaveData)
  }
  getleave(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'leave-types');
  }
  deleteleave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}leave-types/${id}`);
  }
  updateLeave(id: number, leave: any) {
    return this.http.patch(`${this.apiUrl}leave-types/${id}`, leave);
  }

  
  // department
  createdepartment(deptData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'department',deptData)
  }
  getdepartment(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'department');
  }
  deletedept(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}department/${id}`);
  }
  updatedept(id: number, dept: any) {
    return this.http.patch(`${this.apiUrl}department/${id}`, dept);
  }

  // designation
  createdesignation(desigData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'designation',desigData)
  }
  getdesignation(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'designation');
  }
  deletedesig(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}designation/${id}`);
  }
  updatedesignation(id: number, designation: any) {
    return this.http.patch(`${this.apiUrl}designation/${id}`, designation);
  }

  // position
  createposition(positionData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'position',positionData)
  }
  getposition(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'position');
  }
  deletepos(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}position/${id}`);
  }
  updatepos(id: number, pos: any) {
    return this.http.patch(`${this.apiUrl}position/${id}`, pos);
  }

  // announcement
  createAnnouncement(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'announcements', data);
  }

  getAnnouncements(): Observable<any> {
    return this.http.get(this.apiUrl  + 'announcements');
  }

  updateAnnouncement(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}announcements/${id}`, data);
  }

  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}announcements/${id}`);
  }

  // account 
  saveAccountData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}accountsaveedit`, data);
  }

  getAccountDetails(userid: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}account/${userid}`);
  }
}