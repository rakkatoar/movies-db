import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/shared/api/api.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
export interface IMovie {
  adult: boolean;
  backdrop_path: string,
  genre_ids: [],
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count:number
}
export interface IGenre {
  id: string;
  name: string;
}
@Component({
  selector: 'app-card',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height:"100%",
      })),
      state('closed', style({
        height:"0px",
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('1s')
      ]),
    ]),
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() item : Partial<IMovie> = {};
  @Input() genres : Partial<IGenre>[] = [];
  public dataMovies: IMovie [] = [];
  public imageURL: string = '';
  isOpen = false;

  constructor(private apiService: ApiService,) { 
    
    this.imageURL = environment.IMG_URL;
  }
  
  ngOnInit(): void {
  }

  addToFavorite(id:number | undefined){
    const obj = {
      "media_type": "movie",
      "media_id": id,
      "favorite": true
    }
    const account_id = localStorage.getItem('account_id');
    this.apiService
        .postDataApi(`account/${account_id}/favorite`, obj)
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              console.log(res)
            }
          }
        });
  }
  getGenre(itemGenres:[] | undefined){
    let arr: any[] = []
    itemGenres?.forEach(genre => {
      const exists = this.genres?.find(element => element.id === genre)
      arr.push(exists);
    });
    const result = arr.map(element => element.name)
    return result;
  }
  
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
