import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface ICompany {
  id: string;
  name: string;
  logo_path: string;
  origin_country: string;
}
export interface ILanguage {
  english_name: string;
  iso_639_1: string;
  name: string
}
export interface IGenre {
  id: string;
  name: string;
}
export interface IMovie {
  adult: boolean;
  backdrop_path: string,
  belongs_to_collection: {},
  budget: number,
  genres: IGenre[],
  homepage: string,
  id: number,
  imdb_id: string,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  production_companies: ICompany[],
  production_countries : [],
  release_date: string,
  revenue: number,
  runtime: number,
  spoken_languages : ILanguage[],
  status: string,
  tagline: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count:number
  isFavorite: boolean,
}
export interface IFavorite {
  adult: boolean;
  backdrop_path: string;
  genre_ids: [];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count:number;
}
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  private readonly unSubs = new Subject<any>();
  public dataMovie: Partial<IMovie> = {};
  private loading: boolean = true;
  public imageURL: string = '';
  public dataFavorites: IMovie[] = [];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private snackbar: MatSnackBar,
  ) {
    this.imageURL = environment.IMG_URL;
    this.route.queryParams.subscribe(params => {
      let id_movie = params['id_movie'];
      this.getDetail(id_movie)
    });
  }
  
  ngOnInit(): void {
  }

  getDetail(id:number | undefined) {
    this.apiService
      .getDataApi('movie/'+id)
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        this.dataMovie = res;
        console.log(res)
        this.getFavorites(res.id)
      });
  }

  getFavorites(id:number) {
    const account_id = localStorage.getItem('account_id');
    let url = `account/${account_id}/favorite/movies`;
    this.apiService
      .getDataApi(url)
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        const data = res.results.findIndex((element:IFavorite) => element.id === id);
        if(data >= 0){
          this.dataMovie['isFavorite'] = true;
        }
        this.loading = false;
      });
  }

  formatRuntime(data:number){
    const hours = Math.floor(data / 60);
    let runtime:string = '';
    if(hours > 0){
      runtime += hours+' Hour(s) ';
    }
    const minutes = Math.ceil(((data / 60) - hours)*60)
    runtime += minutes+' Minute(s)';
    return runtime
  }
  addToFavorite(id:number | undefined, checked:boolean | undefined){
    const obj = {
      "media_type": "movie",
      "media_id": id,
      "favorite": checked ? false : true
    }
    const account_id = localStorage.getItem('account_id');
    if(account_id){
      this.apiService
          .postDataApi(`account/${account_id}/favorite`, obj)
          .subscribe({
            next: (res: any) => {
              if (res.success) {
                this.snackbar.open(res.status_message, 'OK', {
                  duration: 5000,
                });
                this.getDetail(id)
              } else {
                this.snackbar.open(res.status_message, 'OK', {
                  duration: 5000,
                });
              }
            }
          });
    } else {
      this.snackbar.open("Please create session first.", 'OK', {
        duration: 5000,
      });
    }
  }

}
