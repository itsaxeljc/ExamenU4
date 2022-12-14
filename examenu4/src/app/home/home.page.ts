import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reservacion } from '../models/reservacion';
import { ReservacionService } from '../services/reservacion.service'
import { format, add, parseISO, addDays } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  reservaciones: Reservacion[] = [];
  allRes: Reservacion[] = [];
  filtrar = false;

  constructor(private reservacionService: ReservacionService, private router: Router) {
    this.reservacionService.getReservaciones().subscribe( res => {
      this.allRes = res;
      this.allRes.sort((a: Reservacion, b: Reservacion) => {
        return +new Date(a.fecha) - +new Date(b.fecha);
      });
      this.reservaciones = this.allRes;
    });
  }

  ngOnInit() {
  }

  public getReservaciones(){
      if(this.filtrar){
        this.reservaciones = this.reservaciones.slice(0,2);
      } else {
        this.reservaciones = this.allRes;
      }
  }

  public cerrarSesion() {
    this.router.navigate(['/login']);
  }

  public borrar(id: string){
    this.reservacionService.borrarHuesped(id);
  }
}
