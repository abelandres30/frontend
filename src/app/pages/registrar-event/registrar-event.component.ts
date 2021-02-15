import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EventsService} from '../../services/events.service'
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-event',
  templateUrl: './registrar-event.component.html',
  styleUrls: ['./registrar-event.component.css']
})
export class RegistrarEventComponent implements OnInit {
  ImagenVacia = true;
  imagen: string = "";
  fileImage: any = "";
  newFile: any;
  formData = new FormData();
  FechaHoy: any = ""
  constructor(public eventService: EventsService, private router:Router) { }
  
  ngOnInit() {
 
  }
  handleFileInput(files: File) {
    this.ImagenVacia = false;
    this.fileImage = files;
  }
  registrarImagen() {
    var inputFile = document.getElementById('inputFile1');
    if (inputFile !== null) {
      inputFile.addEventListener('change', mostrarImagen, false);
    }
    function mostrarImagen(event: any) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
        var img = document.getElementById('img1');
        if (img !== null) {
          //marca que esta mal pero sigue funcionando la pagina
          if (event.target !== null) {
            img.src = event.target.result;
          }
          
        }
      }
      reader.readAsDataURL(file);
    }
  }
  Registrarevento(form: NgForm) {
    this.ObtenerFecha();
    if(form.value.title === "" || form.value.description === "" || this.fileImage === "" || form.value.date.length === undefined ) {
      Swal.fire({
        icon: 'error',
        text: 'Faltan datos por agregar',
      })  
    } else if (form.value.date < this.FechaHoy) {
      Swal.fire({
        icon: 'error',
        text: 'La fecho no debe de ser menor a la fecha actual',
      })
    } else {
      for (let i = 0; i < this.fileImage.length; i++) {
        this.newFile = this.fileImage[i];
        this.formData.append("image",this.newFile);
      }
      form.value.image = this.fileImage[0].name;
      form.value.location = "longitud 5";
      form.value.attendances = 0;
      form.value.willYouAttend = true;
      this.FormarData(form);
      this.eventService.postEvents(this.formData)
      .subscribe((res) => {

      });
    }
    
  } 
  ObtenerFecha(){
    var M,D,YY;
    var F = new Date();
    if (F.getMonth()< 10) {
       M = '0' + (F.getMonth() + 1);
    } else {
       M = F.getMonth();
    }
    if (F.getDate() < 10) {
      D = '0' + (F.getDate());
    } else {
      D = F.getDate();
    }
     YY = F.getFullYear();
    this.FechaHoy = YY + '-' + M + '-' + D;
    console.log(this.FechaHoy);
  }

  FormarData(form: NgForm) {
    this.formData.append("title",form.value.title);
    this.formData.append("description",form.value.description);
    this.formData.append("date",form.value.date);
    this.formData.append("attendances",form.value.attendances);
    this.formData.append("willYouAttend",form.value.willYouAttend);
    this.formData.append("location",form.value.location);
    this.formData.append("imagen",form.value.image);
  }
}
