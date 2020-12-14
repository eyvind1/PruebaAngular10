import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  // metodo para listar los productos
  getProductos(){
    return this.firestore.collection("productos").snapshotChanges();
  }

   // metodo para crear los productos
  createProductos(producto:any){
    return this.firestore.collection("productos").add(producto);
  }

  // metodo para actualizar los productos
  updateProductos(id:any, producto:any){
    return this.firestore.collection("productos").doc(id).update(producto);
  }

  // metodo para eliminar los productos
  deleteProductos(id:any){
    return this.firestore.collection("productos").doc(id).delete();
  }
}
