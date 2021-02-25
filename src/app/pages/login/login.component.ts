import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Users } from 'src/app/models/users';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  idUser: string = "";
  booleanUser: boolean = false;
  constructor(public usersService: UsersService, private router: Router, public jwtService: JwtService) { }

  ngOnInit() {
    this.LimpiarForm();
  }
  LimpiarForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.usersService.SelectUser = new Users();
    }
  }

  IniciarCuenta(form: NgForm) {
    if (form.value.email === "" || form.value.password === "") {
      Swal.fire({
        icon: 'error',
        text: 'Faltan datos por agregar',
      })
    } else {
      localStorage.removeItem('idUser');
      this.usersService.getUsers()
        .subscribe(res => {
          this.usersService.UsersAll = res as Users[];
          for (let i = 0; i <= this.usersService.UsersAll.length - 1; i++) {
            if (this.usersService.UsersAll[i].email === form.value.email && this.usersService.UsersAll[i].password === form.value.password) {
              
              this.booleanUser = true;
              this.idUser = this.usersService.UsersAll[i]._id;

            }
          }
          if (this.booleanUser) {
              this.LimpiarForm();
              localStorage.setItem('idUser',this.idUser);
              this.router.navigate(['menu']);
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Usuario o contraseña incorrectos',
            })
          }
        });
    }
  }

}
