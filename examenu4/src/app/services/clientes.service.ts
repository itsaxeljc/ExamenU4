import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  coleccion: AngularFirestoreCollection<Cliente>;

  constructor(private firestore: AngularFirestore) {
    this.coleccion = firestore.collection<Cliente>('cliente');
  }

  getCliente(telefono: string) {
    return this.coleccion.ref.where('telefono', '==', telefono).get();
  }

}
