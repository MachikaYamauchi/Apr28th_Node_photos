import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Photo } from '../interfaces/photo.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoserviceService {

  private server = environment.server;
  private url = this.server + "photosapi";
  private fileuploadURL = this.server + "upload";
  private photoURL = this.server + "photos"

  constructor(private http:HttpClient) { }

  getAllPhotos() {
    return this.http.get<{allphotos:[Photo[]], message:any}>(this.photoURL);
  }

  getPhotoById(id:number) {
    return this.http.get<{photo:Photo, message:any}>(this.photoURL + "/" + id)
  }

  uploadFile(formdata:any) {
    return this.http.post(this.fileuploadURL, formdata)
  }

  addnewPhoto(albumId:number, title:string, filename:string) {
    let newphotobody = {
      "albumId_fromC":albumId,
      "title_fromC": title,
      "url_fromC": filename,
      "tn_fromC": "tn_claudel-rheault-ZVbv1akA-l4-unsplash.jpg"
    }
    return this.http.post<{newphoto:Photo[], message:any}>(this.photoURL, newphotobody)
  }

  deletePhoto(id:number) {
    return this.http.delete<{deleteStatus:any, message:any}>(this.photoURL + "/" + id);
  }


}
