import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Users } from '../models/users';
import { Observable } from 'rxjs';
import { EventAttend } from '../models/eventAttend';
@Injectable({
  providedIn: 'root'
})
export class EventAttendService {
  readonly URL_API = 'http://localhost:3000/evento/asistencia'; 
  SelectEventAttend: EventAttend = new EventAttend;
  EventAttendAll: EventAttend[] = [];
  constructor(private http: HttpClient) { }
  
  getEventAttend() {
    return this.http.get(this.URL_API);
  };
  postEventAttend(EventAttend:any): Observable<any> {
    return this.http.post(this.URL_API, EventAttend);
  }  
  putEventAttend(EventAttend: Users) {
    return this.http.put(this.URL_API + '/${Users._id}',EventAttend);
  }
  deleteEventAttend(_id: string) {
    return this.http.delete(this.URL_API + '/${_id}');
  }
  getEventAttendByid(_id: any) {
    return this.http.get(this.URL_API + '/' +  _id);
  }
}
