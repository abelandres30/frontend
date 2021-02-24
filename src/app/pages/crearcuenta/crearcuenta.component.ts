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
  constructor(public usersService: UsersService, private router: Router) { }

  ngOnInit() {
    this.LimpiarForm();


    //este es el codigo para limitar a que los input solo acepten letras
    $('#LetrasNombre,#LetrasApellidos').keypress(function(tecla){
      var regex = new RegExp("^[a-zA-Z ]+$");
      var key = String.fromCharCode(!tecla.charCode ? tecla.which : tecla.charCode);
      if (!regex.test(key)) {
        tecla.preventDefault();
      }
      return true;

    }); 
   
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
          text: 'el correo ingresado es incorrecto',
        })
      } else if (form.value.password.length < 8) {
        Swal.fire({
          icon: 'error',
          text: 'La contraseña debe tener un minimo de 8 caracteres',
        })
      } else {
        if (this.booleanosUserExist) {
          Swal.fire({
            icon: 'error',
            text: 'La cuenta con ese correo electronico ya existe',
          })
        } else {
          var confirPass = $("#Confpassword").val();
          if (confirPass === form.value.password) {
            this.usersService.postUsers(form.value)
              .subscribe(newpres => {
                this.LimpiarForm(form);
                Swal.fire({
                  icon: 'success',
                  title: 'Usuario registrado correctamente',
                  showConfirmButton: true,
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['login']);
                  }
                })
              });
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Las contraseña no coincide',
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
