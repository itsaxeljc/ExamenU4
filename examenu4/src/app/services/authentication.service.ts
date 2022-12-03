import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  coleccion: AngularFirestoreCollection<Cliente>;

  constructor( private router: Router, private alertController: AlertController, private firestore: AngularFirestore) {
    this.coleccion = firestore.collection<Cliente>('clientes');
  }

  getCliente(telefono: string) {
    return this.coleccion.ref.where('telefono', '==', telefono).get();
  }
}
