import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpEventType, HttpProgressEvent} from '@angular/common/http';
import { Subscription, finalize, Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

 
  requiredFileType:string="";

  /* fileName = '';
  uploadProgress:number=0;
  uploadSub: Subscription | null = null; */
  BASE_URL :string= "https://staging.dracoon.com/api/v4"
  ACCESS_TOKEN:string = "LTzH6qVrgphTmAV6KIHIbetylpZJCPG8"
  PARENT_ID:string = "1107008"
  file:null | File = null;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {}

  

  async click (){
    console.log(this.file);
    if(!this.file){
      return
    }

   this.postData()
  }


  postData() {
    if(!this.file) return
    const file = this.file
    const headers = {  'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.ACCESS_TOKEN}`};
    const body = {  directS3Upload: true,
      name: `${file.name}`,
      parentId: `${this.PARENT_ID}`,
      size: `${file.size}`}
     this.http.post<any>(`${this.BASE_URL}/nodes/files/uploads`, body, { headers }).subscribe(data => {
         const uploadId = data.uploadId;
        console.log(data);

      this.http.post<any>(`${this.BASE_URL}/nodes/files/uploads/${uploadId}/s3_urls`, {
        firstPartNumber: 1,
        lastPartNumber: 1,
        size: `${file.size}`
    }, { headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
  } }).subscribe(data => {
          const url = data.urls[0].url;
          console.log(data);
    /*    const arrayBuffer = new FileReader().readAsArrayBuffer(file.) */
          /* // @ts-ignore
          const octet = new Uint8Array(new FileReader().readAsArrayBuffer(file));  */

          this.http.put<any>(`${url}`, {body:file}, { headers:{
            'Content-Type': 'application/octet-stream',
           /* 'Authorization': `Bearer ${this.ACCESS_TOKEN}`*/
        } }).subscribe(data => {
            /* this.ETag = data.ETag; */
            console.log(data);
            
        });
         
        });
        
    });

 
  }



  onFileSelected(event:Event) {
    this.file = (event.target as HTMLInputElement).files![0] as File 
    
   /*  if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("thumbnail", file);

        
    } */
}
  
  }
 


