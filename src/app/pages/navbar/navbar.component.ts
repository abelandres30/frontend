import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  id: any = "";
  userName: string = "";
  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('idUser');
    this.obtenerUser();

  }
  obtenerUser() {
    this.usersService.getUserByid(this.id)
      .subscribe(user => {
        this.usersService.SelectUser = user as Users;
        this.userName = this.usersService.SelectUser.firstName;
      })
  }
  cerrarSesion() {
    Swal.fire({
      title: '¿Deseas cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'cerrar sesion'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("idUser");
        this.router.navigate(['login']);
      }
    })

  }
}
