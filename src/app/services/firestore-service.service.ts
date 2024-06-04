import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {
  constructor(private firestore: AngularFirestore) {}

  addItem(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data);
  }

  getItems(collectionName: string) {
    return this.firestore.collection(collectionName).snapshotChanges();
  }

  updateItem(collectionName: string, docId: string, data: any) {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  deleteItem(collectionName: string, docId: string) {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }
}
