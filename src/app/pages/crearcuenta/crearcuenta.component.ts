import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Users } from 'src/app/models/users';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-crearcuenta',
  templateUrl: './crearcuenta.component.html',
  styleUrls: ['./crearcuenta.component.css'],
})
export class CrearcuentaComponent implements OnInit {
  booleanosUserExist: boolean = false;
  confirPass: string = "";
  constructor(public usersService: UsersService, private router: Router) { }

  ngOnInit() {
    this.LimpiarForm();
  }

  AgregarCuenta(form: NgForm) {
    if (form.value.lastName === "" || form.value.firstName === "" || form.value.password === "" || form.value.email === "") {
      Swal.fire({
        icon: 'error',
        text: 'Faltan datos por agregar',
      })

    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)+$/.test(form.value.email)) {
        Swal.fire({
          icon: 'error',
          text: 'el correo ingresado no es valido',
        })
      } else if (form.value.password.length < 8) {

        Swal.fire({
          icon: 'error',
          text: 'La contraseña debe contener al menos 8 digitos',
        })
      } else {
        if (this.booleanosUserExist) {
          Swal.fire({
            icon: 'error',
            text: 'El correo ingresado ya existe',
          })
        } else {
          if (this.confirPass === form.value.password) {
            this.usersService.postUsers(form.value)
              .subscribe(newpres => {
                this.LimpiarForm(form);
                Swal.fire({
                  icon: 'success',
                  title: 'Se creo con exito la cuenta',
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['menu']);
                  }
                })
              });
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Las contraseñas no coinciden',
            })
          }

        }

      }
    }


  }

  LimpiarForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.usersService.SelectUser = new Users();
    }
  }
  ObtenerUsers(form: NgForm) {
    form.value.gender = $('input[name="radioButton"]:checked').val();
    this.confirPass = $("#Confpassword").toString();

    this.booleanosUserExist = false;
    this.usersService.getUsers()
      .subscribe(res => {
        this.usersService.UsersAll = res as Users[];
        for (let i = 0; i <= this.usersService.UsersAll.length - 1; i++) {
          if (form.value.email === this.usersService.UsersAll[i].email) {
            this.booleanosUserExist = true;
          }
        }
        this.AgregarCuenta(form);
      });
  }
}
