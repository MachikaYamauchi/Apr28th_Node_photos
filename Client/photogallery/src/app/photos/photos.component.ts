import { Component, OnInit } from '@angular/core';
import { Photo } from '../interfaces/photo.interface';
import { PhotoserviceService } from '../services/photoservice.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  photos:any[] = [];
  myformdate:any;
  //
  albumId:number = 0;
  title:string = '';
  // trackFile()で取得したデータを入れるproperty
  filename:string = '';

  // To practice @Input() in "printname" component
  myname = "John";
  textcolor = "purple";


  constructor(private ps:PhotoserviceService) { }

  // phisical fileをserverにuploadするためのmethod
  trackFile(event:any) {
    let myfile = event.target.files[0];
    // このfilenameは、他のmethodつまり、addNewTweetで使うため、myfile.nameを代入している
    this.filename = myfile.name;
    console.log("MY FILE ---> ", myfile);
    const formdata = new FormData();
    formdata.append("file_fromC", myfile, myfile.name);
    // console.log("formdata --> ", formdata);
    this.myformdate = formdata;
  }

  // When adding new photo, (1)add data to DB, (2)upload phisical file into server
  addNewPhoto() {
    // console.log(this.albumId, this.title, this.filename);
    this.ps.addnewPhoto(this.albumId, this.title, this.filename).subscribe(newphoto => {
      console.log(newphoto);
      this.ps.uploadFile(this.myformdate).subscribe(uploadMessage => {
        console.log(uploadMessage);
        this.photos.unshift(newphoto.newphoto[0]);
      })
    })
  }

  deletePhoto(id:number, photocard:HTMLElement) {
    if(confirm("Are you sure you want to delete?")) {
      // we write code to
      this.ps.deletePhoto(id).subscribe(deleteSuccessMessage => {
        console.log(deleteSuccessMessage);
        if(deleteSuccessMessage.deleteStatus === 1) {
          console.log(photocard);
          photocard.className = 'fadeout';
          let index = this.photos.findIndex(photo => photo.id === id);
          console.log(index);
          setTimeout(()=> {
            this.photos.splice(index, 1)
          },
          2000)
        }
      })

    }
  }

  ngOnInit(): void {
    this.ps.getAllPhotos().subscribe((photos) => {
      console.log(photos.allphotos);
      this.photos = photos.allphotos;
    })
    // this.photos = this.jsonData;
  }

}
