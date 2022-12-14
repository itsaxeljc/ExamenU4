import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from '../services/clientes.service';
import { Reservacion } from '../models/reservacion';
import { ReservacionService } from '../services/reservacion.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { format, add, parseISO, addDays } from 'date-fns';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit {
  reservaciones: Reservacion[] = [];
  hoy = new Date().toISOString();
  fechaIngreso: string;

  tel = '';
  reservacion: Reservacion = {
    costoTotal: 1000,
    fecha: '',
    nombreCliente: '',
    telefonoCliente: '',
    alberca: 0,
    brincolin: false,
    futbolito: false,
    mesaPostres: false,
  };

  constructor(private activatedRoute: ActivatedRoute, private clientesService: ClientesService,
    private reservacionService: ReservacionService, private router: Router, private alertController: AlertController) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state){
          this.tel = this.router.getCurrentNavigation().extras.state.telefono;
          this.clientesService.getCliente(this.tel).then((doc) => {
            const cliente = doc.docs[0].data();
            this.reservacion.nombreCliente = cliente.nombre;
            this.reservacion.telefonoCliente = cliente.telefono;
            console.log(cliente.nombre+" AQUI "+cliente.telefono);
          });
        }
      })
     }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['telefono']) {
        this.clientesService.getCliente(params['telefono']).then((doc) => {
          const cliente = doc.docs[0].data();
          this.reservacion.nombreCliente = cliente.nombre;
          this.reservacion.telefonoCliente = cliente.telefono;
          console.log(cliente.nombre+" AQUI "+cliente.telefono);
        });
      }
    });

    this.reservacionService.getReservaciones().subscribe( res => {
      this.reservaciones = res;
    })
  }

  calcular() {
    this.reservacion.costoTotal = 1000;
    if (this.reservacion.alberca) {
      this.reservacion.costoTotal += this.reservacion.alberca * 100;
    }

    if (this.reservacion.brincolin) {
      this.reservacion.costoTotal += 200;
    }

    if (this.reservacion.futbolito) {
      this.reservacion.costoTotal += 100;
    }

    if (this.reservacion.mesaPostres) {
      this.reservacion.costoTotal += 150;
    }
  }

  reservar(){
    if (
      this.reservaciones.filter((reservacion) =>
        reservacion.fecha.startsWith(this.reservacion.fecha.substring(0, 10))
      ).length > 0
    ) {
      console.log('fecha ocupada');
      this.alert();
    } else {
      this.reservacionService.addReservacion(this.reservacion);
      this.back();
    }
  }

  back(): void{
    this.router.navigate(['/login']);
  }

  async alert() {
    const alert = await this.alertController.create({
      header: 'Error de fecha',
      subHeader: 'Fecha ocupada, elija otra',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  public cerrarSesion() {
    this.router.navigate(['/login']);
  }

  public fechaSeleccionadaIngreso(evento: any): void {
    try {
      const ingreso = format(parseISO(evento.detail.value), 'yyyy-MM-dd');
      this.reservacion.fecha = format(addDays(parseISO(ingreso), 0), 'yyyy-MM-dd');
      console.log(this.reservacion.fecha);
    } catch (error) {
      console.error(error);
    }
  }
}

