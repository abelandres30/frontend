import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Users } from '../models/users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly URL_API = 'http://localhost:3000/user/login'; 
  SelectUser: Users = new Users;
  UsersAll: Users[] = [];
  constructor(private http: HttpClient) { }
  
  getUsers() {
    return this.http.get(this.URL_API);
  };
  postUsers(Users: Users): Observable<any> {
    return this.http.post(this.URL_API, Users);
  }  
  putUsers(Users: Users) {
    return this.http.put(this.URL_API + '/${Users._id}',Users);
  }
  deleteUsers(_id: string) {
    return this.http.delete(this.URL_API + '/${_id}');
  }
  getUserByid(_id: any) {
    return this.http.get(this.URL_API + '/' +  _id);
  }
}
