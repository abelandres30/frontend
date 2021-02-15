import { Component, OnInit } from '@angular/core';
import { Events } from 'src/app/models/events';
import {Users} from 'src/app/models/users';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JwtService } from '../../services/jwt.service';
import { PaginacionService } from '../../services/paginacion.service';
import {UsersService} from '../../services/users.service';
import {EventAttendService} from '../../services/event-attend.service'

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
  booleanEvent: boolean = false;
  pager: any = {};
  totalEvents: number = 0;
  id: any = "";

  constructor(private eventsService: EventsService, private router: Router, public jwtService: JwtService,
    private PaginacionService: PaginacionService, private route: ActivatedRoute,private usersService: UsersService,
    private eventAttendService:EventAttendService) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('idUser');
    this.obtenerUser();
    this.obtenerEvents();
    
  }

  obtenerEvents() {
    this.eventsService.getEvents()
      .subscribe(res => {
        this.eventsService.EventsAll = res as Events[];
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
  AsistirEvent(eventInfo: any) {
    const registro = new EventAttend();
    registro.EventID = eventInfo;
    registro.UserID = this.id;
    registro.willYouAttend = true;


    if (eventInfo !== undefined) {
      this.eventAttendService.postEventAttend(registro)
      .subscribe(res => {
        Swal.fire('Se ha registrado la asistencia')

      });
    }
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
    this.pager = this.PaginacionService.getPager(this.totalEvents, page,10);

    this.eventsService.EventsAllPager = this.eventsService.EventsAll.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.pager.currentPage = this.pager.currentPage;
  }
  obtenerUser() {
    this.usersService.getUserByid(this.id)
    .subscribe(user => {
      this.usersService.SelectUser = user as Users;
    }) 
  }
}
