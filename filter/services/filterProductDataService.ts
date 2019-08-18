import {Injectable} from '@angular/core'
import { url } from 'src/app/globalmodel/url';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpOptions } from 'src/app/globalmodel/headerDetails';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class FilterProductDataService{
   
  private url='http://localhost:1234/filterproducts/getfilteredproducts';
constructor(private http:HttpClient){

}
handleError(error:HttpErrorResponse){
    let err='';
      if(error.error instanceof ErrorEvent){
       err='FrontEnd Error'
        } 
        else if(error.status!=200){
          err=error.error;
        }
  
          return throwError(
      err);
         };

getFilteredProducts(obj):Observable<any>{
  return this.http.post(this.url,obj,httpOptions.jsonHeaders).pipe(catchError(this.handleError));
  
}


    


}