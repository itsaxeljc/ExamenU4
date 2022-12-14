import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Reservacion } from "../models/reservacion";


@Injectable({
  providedIn: 'root'
})
export class ReservacionService {


  coleccionReservacion: AngularFirestoreCollection<Reservacion>;
  constructor(private firestore: AngularFirestore) { 
    this.coleccionReservacion = firestore.collection<Reservacion>('Reservaciones');
  }

  public getReservaciones() {
    return this.firestore.collection('Reservaciones').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Reservacion;
          const id = a.payload.doc.id;
          return { id, ...data }; 
        });
      })
    );
  }

  public addReservacion(reservacion: Reservacion){
    this.firestore.collection('Reservaciones').add(reservacion);
  }

  public borrarHuesped(id: string){
    this.firestore.collection('Reservaciones').doc(id).delete();
  }

  getDatos() {
    return this.coleccionReservacion;
  }
}
