import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface LeaveBalance {
  type: string;
  type_id: number;
  allowed: number;
  used: number;
  remaining: number;
}
export interface LeaveBalanceResponse {
  years_of_service: number;
  balances: LeaveBalance[];
}
export interface Certificate {
  id: number;
  name: string;
  file: string;
  file_url: string;
  created_at: string;
}

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
  // done
  // dionece 

  // private userPicSubject = new BehaviorSubject<string | null>(null); // Store user image URL
  // userPic$ = this.userPicSubject.asObservable();
  
  getLeaveBalances(userId: number): Observable<LeaveBalanceResponse> {
    return this.http.get<LeaveBalanceResponse>(`${this.apiUrl}leave-getLeaveBalances/${userId}`);
  }

  uploadFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files[]', file);
    }
    return this.http.post(this.apiUrl + 'upload-files', formData);
  }

  private adminPicSubject = new BehaviorSubject<string | null>(null); // This will store the admin image URL
  adminPic$ = this.adminPicSubject.asObservable();

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
  getCounts(): Observable<{ approved_users: number; pending_users:number; total_announcements: number }> {
    return this.http.get<{ approved_users: number; pending_users:number; total_announcements: number }>(this.apiUrl  + 'users/count');
  }
  leavecount(): Observable<{  pending_exec_sec: number }> {
    return this.http.get<{  pending_exec_sec: number }>(this.apiUrl  + 'leavecount');
  }
  leavecountpresident(): Observable<{  pending_pres: number }> {
    return this.http.get<{  pending_pres: number }>(this.apiUrl  + 'presapplieadleave');
  }
  getDashboardData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}dashboard-data/${userId}`);
  }
  dashdheaddata(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}dheadapplieadleave/${id}`);
  }
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8000/api/upload-image', formData);
  }
  
  updateUserPic(newImageUrl: string) {
    this.adminPicSubject.next(newImageUrl); // Emit new image URL
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

  // workstatus
  getworkstatus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'workstatus');
  }
  deleteworkstatus(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}workstatus/${id}`);
  }
  updateworkstatus(id: number, wstat: any) {
    return this.http.patch(`${this.apiUrl}workstatus/${id}`, wstat);
  }
  createworkstatus(workstatusData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'workstatus',workstatusData)
  }

  //category
  getcategory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'category');
  }
  deletecategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}category/${id}`);
  }
  updatecategory(id: number, wstat: any) {
    return this.http.patch(`${this.apiUrl}category/${id}`, wstat);
  }
  createcategory(categoryData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'category',categoryData)
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

  // reqleave user
  getdepthead(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'departmentheads');
  }
  submitLeaveRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}leaverequests`, data);
  }
  getLeaveRequestsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}leaverequests/user/${userId}`);
  }
  deleteLeaveRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}leaverequests/${id}`);
  }
  updatedetails(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-requests/userupdate/${id}`, data);
  }
  updateDates(id: number, dates: { from: string, to: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-requests/${id}`, dates);
  }
  // getLeaveRequests(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl + 'leaverequests');
  // }
  getLeaveRequestsByDHead(dheadId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}leave-requests/dhead/${dheadId}`);
  }
  getLeaveRequestsByexecsec(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'executivesec');
  }
  getLeaveRequestsBypresident(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'president');
  }
  // dhead 
  accept(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-reqs/${id}/approve`, null); // Pass null as the body since no data is needed
  }
  reject(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-reqs/${id}/reject`, null);
  }
  // exec 
  acceptexecsec(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-execsec/${id}/approve`, null); // Pass null as the body since no data is needed
  }
  rejectexecsec(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-execsec/${id}/reject`, null);
  }
  // pres 

  acceptpres(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-pres/${id}/approve`, null); // Pass null as the body since no data is needed
  }
  rejectpres(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}leave-pres/${id}/reject`, null);
  }
  // countleavedash(userId: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}leave-count/${userId}`);
  // }
  countleavedash(userId: string): Observable<{ pending: number, approved: number, rejected: number, events_today: number }> {
    return this.http.get<{ pending: number, approved: number, rejected: number, events_today: number }>(`${this.apiUrl}leave-count/${userId}`);
  }
  
  // getEvents(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}events`);
  // }

  createEvent(eventData: any) {
    return this.http.post(this.apiUrl + 'events', eventData);
  }
  getEventsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}events/user/${userId}`);
  }
  updateEvents(id: number, event: any) {
    return this.http.put(`${this.apiUrl}events/${id}`, event);
  }
  deleteEvents(id: number) {
    return this.http.delete(`${this.apiUrl}events/${id}`);
  }
  createnlmEvent(eventData: any) {
    return this.http.post(this.apiUrl + 'nlmevents', eventData);
  }
  // files
  // getFiles(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl + 'requestfile');
  // }
  storeOrUpdateAccCode(userId: number, accCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}store-or-update-acc-code/${userId}`, { acc_code: accCode });
  }
  getrecordsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}requestfile/records/${userId}`);
  }
  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'soarecords');
  }
  createFile(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'requestfile', data);
  }
  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}requestfile/${id}`);
  }
  updateFile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}requestfile/${id}`, data);
  }

  // archive
  filerecords(): Observable<any> {
    return this.http.get(this.apiUrl + 'filerecords');
  } 


  // notif 
  // getNotifications(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}notifications`);
  // }
  getNotifications(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}notifications/${userId}`);
}
  // markAsRead(id: number): Observable<any> {
  //   return this.http.patch(`${this.apiUrl}notif/${id}/read`, { is_read: true });
  // }
 
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}notifications/${notificationId}/read`, {});
  }
  markAsdelete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}notifications/${id}`);
  }
  getNotificationCount(userId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}notifications/unread-count/${userId}`);
  }
  postcertificate(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'post-cert', data);
  }

  getCertificatesByUserId(userId: number): Observable<any> {
      return this.http.get(`${this.apiUrl}certbyid/${userId}`);
  }
  deleteCertificate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delcertificates/${id}`);
  }
}