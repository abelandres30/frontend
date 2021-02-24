import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
export interface MapboxOutput {
  attribution:string;
  features: Feature[];
  query: [];
}
export interface Feature {
  place_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapboxServiceService {

  constructor(private http:HttpClient) { }

  // search_word(query: string) {
  //   const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  //    return this.http.get(url + query + '.json?types=address&access_token='
  //    + 'pk.eyJ1Ijoic3dvcmRsZWdlbmRhcnkiLCJhIjoiY2tsaW5sMHZyMW00aTJ2bzZvMHl6ZzI1eiJ9.e6sqEuvKS-omYqXf__t0tQ')
  //    .pipe(map((res: MapboxOutput) => {
  //     return res.features;
  //    }));  
  // }
}
