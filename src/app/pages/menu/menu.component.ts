import { Component, OnInit } from '@angular/core';
import { Events } from 'src/app/models/events';
import { Users } from 'src/app/models/users';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JwtService } from '../../services/jwt.service';
import { PaginacionService } from '../../services/paginacion.service';
import { UsersService } from '../../services/users.service';
import { EventAttendService } from '../../services/event-attend.service'
import { EventAttends } from 'src/app/models/eventAttend';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

class EventAttend {
  UserID: string = "";
  EventID: string = "";
  willYouAttend: boolean = false;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  idEvent: string = "";
  booleanEvent: boolean[] = [];
  pager: any = {};
  totalEvents: number = 0;
  id: any = "";
  posicion: number = 0;
  constructor(private eventsService: EventsService, private router: Router, public jwtService: JwtService,
    private PaginacionService: PaginacionService, private route: ActivatedRoute, private usersService: UsersService,
    private eventAttendService: EventAttendService) { }

  ngOnInit() {


    this.id = localStorage.getItem('idUser');
    this.obtenerUser();
    this.obtenerEventsMios();



  }
  obtenerEventsMios() {
    this.eventAttendService.EventAttendAll = [];
    this.eventsService.EventsAll = [];
    this.eventsService.EventsAllPager = [];
    this.eventAttendService.getEventAttend()
      .subscribe(res => {
        this.eventAttendService.EventAttendAll = res as EventAttends[];
        this.obtenerEvents();

      });
  }


  obtenerEvents() {
    this.eventsService.getEvents()
      .subscribe(res => {
        this.eventsService.EventsAll = res as Events[];
        this.eventsService.EventsAll = this.eventsService.EventsAll.reverse();
        this.obtenerTrues();
        this.totalEvents = this.eventsService.EventsAll.length;
        this.route.queryParams.subscribe(params => { //toma variable del url

          if (params['pagina'] != null || params['pagina'] >= 0) {
            this.setPage(params['pagina']);
          } else {
            this.setPage(1);
          }
        });
      });

  }
  obtenerTrues() {
    let Entro = false;
    for (let i = 0; i < this.eventsService.EventsAll.length; i++) {
      Entro = false;
      for (let o = 0; o < this.eventAttendService.EventAttendAll.length; o++) {
        if (this.eventAttendService.EventAttendAll[o].EventID === this.eventsService.EventsAll[i]._id && this.eventAttendService.EventAttendAll[o].UserID === this.usersService.SelectUser._id) {
          this.booleanEvent.push(true);
          Entro = true;
        }

      }
      if (Entro === false) {
        this.booleanEvent.push(false);

      }
    }

  }
  AsistirEvent(eventInfo: any, i: number) {
    const registro = new EventAttend();
    registro.EventID = eventInfo;
    registro.UserID = this.id;
    registro.willYouAttend = true;


    if (eventInfo !== undefined) {
      this.eventAttendService.postEventAttend(registro)
        .subscribe(res => {
          this.booleanEvent[i] = true;
          this.eventsService.EventsAllPager[i].attendances = this.eventsService.EventsAllPager[i].attendances + 1;
          Swal.fire('Se ha registrado la asistencia')
          this.ModificarEvent(eventInfo, i);
        });
    }
  }

  CancelarEvent(eventInfo: any, posicion: number) {
    for (let i = 0; i < this.eventAttendService.EventAttendAll.length; i++) {
      if (this.eventAttendService.EventAttendAll[i].EventID === eventInfo && this.eventAttendService.EventAttendAll[i].UserID === this.usersService.SelectUser._id) {
        this.eventAttendService.deleteEventAttend(this.eventAttendService.EventAttendAll[i]._id)
          .subscribe(res => {
            this.booleanEvent[posicion] = false;
            this.eventsService.EventsAllPager[posicion].attendances = this.eventsService.EventsAllPager[posicion].attendances - 1;
            Swal.fire('Se cancelo la asistencia a este evento')
            this.ModificarEvent(eventInfo, posicion);
          });
      }
    }

  }

  ModificarEvent(eventInfo: any, i: number) {
    const registro = new Events();
    registro._id = eventInfo;
    registro.attendances = this.eventsService.EventsAllPager[i].attendances;
    registro.date = this.eventsService.EventsAllPager[i].date;
    registro.description = this.eventsService.EventsAllPager[i].description;
    registro.imagen = this.eventsService.EventsAllPager[i].imagen;
    registro.location = this.eventsService.EventsAllPager[i].location;
    registro.title = this.eventsService.EventsAllPager[i].title;
    registro.willYouAttend = this.eventsService.EventsAllPager[i].willYouAttend;
    this.eventsService.putEvents(registro)
      .subscribe(res => {
        this.obtenerEventsMios();
      });
  }


  setUrl(page: number) {
    this.router.navigate(['/menu'], { queryParams: { pagina: page } });
  }
  setPage(page: number) {
    // this.arriba();
    if (page < 1) {
      this.router.navigate(['/menu'], { queryParams: { pagina: 1 } });
      return;
    } else if (page > this.pager.totalPages) {
      this.router.navigate(['/menu'], { queryParams: { pagina: this.pager.totalPages } });
      return;
    }
    // get pager object from service
    this.pager = this.PaginacionService.getPager(this.totalEvents, page, 10);

    this.eventsService.EventsAllPager = this.eventsService.EventsAll.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.pager.currentPage = this.pager.currentPage;
  }
  ObtenerLocalizaciones(lugar: string,i: number) {
    this.posicion = -1;
    setTimeout(function(){ 
      var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
      mapboxgl.accessToken = 'pk.eyJ1Ijoic3dvcmRsZWdlbmRhcnkiLCJhIjoiY2tsaW5sMHZyMW00aTJ2bzZvMHl6ZzI1eiJ9.e6sqEuvKS-omYqXf__t0tQ';
      var CoordenadaSeparada = lugar.split(',');
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [CoordenadaSeparada[0], CoordenadaSeparada[1]], // starting position
        zoom: 15// starting zoom
      });
      var marker = new mapboxgl.Marker()
        .setLngLat([CoordenadaSeparada[0], CoordenadaSeparada[1]])
        .addTo(map);

     }, 1000);
     this.posicion = i;

    
  }
  obtenerUser() {
    this.usersService.getUserByid(this.id)
      .subscribe(user => {
        this.usersService.SelectUser = user as Users;
      })
  }
}
