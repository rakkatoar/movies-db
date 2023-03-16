import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
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
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() item : Partial<IMovie> = {};
  public dataMovies: IMovie [] = [];
  public imageURL: string = '';
  constructor() { 
    this.imageURL = environment.IMG_URL;
  }

  ngOnInit(): void {
  }

}
