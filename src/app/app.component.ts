import { Component, OnInit } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from './services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Modal
  closeResult = '';
  //
  productoForm: FormGroup;
  idFirebaseActualizar: string;
  actualizar: boolean;


  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
    ){}

  // contiene informacion de la pagina
  config: any;

  collection = {count: 0, data: []}

  ngOnInit(): void {
    this.idFirebaseActualizar = "";
    this.actualizar = false;


    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };

    this.productoForm = this.fb.group({
      id: ['', Validators.required],
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
    });

    this.firebaseServiceService.getProductos().subscribe(resp=>{
      this.collection.data = resp.map((e:any)=>{
        return {
          id: e.payload.doc.data().id,
          producto: e.payload.doc.data().producto,
          categoria: e.payload.doc.data().categoria,
          idFirebase: e.payload.doc.id,
        }
      })
    },
    error =>{
      console.error(error);
    }
    );    
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  eliminar (item:any): void{
    this.firebaseServiceService.deleteProductos(item.idFirebase);
  }

  guardarProducto(): void {

    this.firebaseServiceService.createProductos(this.productoForm.value).then(resp=>{
      this.productoForm.reset();
      this.modalService.dismissAll();
    }).catch(error =>{
      console.error(error)
    })
    
  }


  actualizarProducto(){
    if(!isNullOrUndefined(this.idFirebaseActualizar)){
      this.firebaseServiceService.updateProductos(this.idFirebaseActualizar, this.productoForm.value).then(resp=>{
        this.productoForm.reset();
        this.modalService.dismissAll();
      }).catch(error=>{
        console.error(error);
      });
    }
    
  }

  openEditar(content, item:any) {
    //llenar form para editar
    this.productoForm.setValue({
      id: item.id,
      producto: item.producto,
      categoria: item.categoria,
    });

    //actualizar id de firebase
    this.idFirebaseActualizar = item.idFirebase;
    //muestra el boton editar
    this.actualizar = true;
    //modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    //oculta el boton actualizar
    this.actualizar = false;
    //modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
}
