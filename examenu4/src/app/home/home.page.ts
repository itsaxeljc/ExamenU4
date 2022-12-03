import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reservacion } from '../models/reservacion';
import { ReservacionService } from '../services/reservacion.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  reservaciones: Reservacion[] = [];
  filtrar = false;

  constructor(private reservacionService: ReservacionService, private router: Router) {}

  ngOnInit() {
    this.getReservaciones();
  }

  public getReservaciones(){
    this.reservacionService
      .getDatos()
      .get()
      .subscribe((datos) => {
        this.reservaciones = [];
        if (!this.filtrar) {
          datos.forEach((doc) => this.reservaciones.push(doc.data()));
        } else {
          const hoy = new Date(
            new Date().toISOString().substring(0, 10)
          ).getTime();
          datos.forEach((doc) => {
            const reservacion = doc.data();
            const diaReservacion = new Date(
              reservacion.fecha.substring(0, 10)
            ).getTime();
            if (diaReservacion >= hoy && diaReservacion <= hoy + 172800000) {
              this.reservaciones.push(reservacion);
            }
          });
        }
      });
  }

  public cerrarSesion() {
    this.router.navigate(['/login']);
  }
}
