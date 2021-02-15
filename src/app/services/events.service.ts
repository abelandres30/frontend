import {HttpClient} from '@angular/common/http';
import { Events } from '../models/events';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EventsService {

  readonly URL_API = 'http://localhost:3000/event/menu';
  readonly URL_APII = 'http://localhost:3000/imagen/imagenes'; 
 
  SelectEvent: Events = new Events;
  EventsAll: Events[] = [];
  EventsAllPager: Events[] = [];
  constructor(private http: HttpClient) { }
  
  getEvents() {
    return this.http.get(this.URL_API);
  };
  postEvents( Events: FormData) {
    return this.http.post(this.URL_API,Events);
  } 
  postImagenes(image:any) {
   
    return this.http.post(this.URL_APII,image);
  }   
  putEvents(Events: Events) {
    return this.http.put(this.URL_API + '/${Users._id}',Events);
  }
  deleteEvents(_id: string) {
    return this.http.delete(this.URL_API + '/${_id}');
  }}
