import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../services/clientes.service';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  telefono = '';
  public myForm: FormGroup;
  public validationMessages: Object;

  constructor(
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
    private router: Router, 
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.myForm = this.formBuilder.group({
      token: ['', Validators.compose([Validators.required])],
    });

    this.validationMessages = {
      token: [
        {
          type: 'required',
          message: 'Campo requerido para continuar',
        },
      ],
    };
  }

  async login() {
    const telefono: string = this.myForm.get('token').value;
    if (telefono.includes('admin')) {
      this.router.navigate(['/', 'home']);
    }else{
      this.clientesService.getCliente(telefono).then((query) => {
        if (query.docs.length == 0) {
          this.presentAlert();
          console.log('Telefono no registrado');
        } else {
          let navigationExtras: NavigationExtras = {
            state: {
              telefono: telefono
            }
          }
          this.router.navigate(['/reservaciones'], navigationExtras);
        }
      });
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'El user ingresado no es válido',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
