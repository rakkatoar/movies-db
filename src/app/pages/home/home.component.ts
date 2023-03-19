import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
export interface IDate {
  start: string;
  end: string;
}
export interface ISort {
  code: string;
  title: string;
}
export interface IGenre {
  id: string;
  name: string;
}
export interface IMovie {
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly unSubs = new Subject<any>();
  private loading: boolean = true;
  private filterDate: Partial<IDate> = {};
  public dataFavorites: IMovie[] = [];
  public dataMovies: IMovie[] = [];
  public dataGenres: IGenre[] = [];
  public pageIndex: number = 0;
  public totalMovies: number = 0;
  private page: number = 1;
  public activeSort: ISort = {
    code:'popularity.desc',
    title: 'Popularity: Highest'
  };
  constructor(
    private apiService: ApiService,
  ) {
    this.getFavorites()
    this.getGenre()
   }

  ngOnInit(): void {
  }

  getMovies(page: number, sort: ISort, date: Partial<IDate>) {
    this.page = page;
    this.activeSort = sort;
    this.filterDate = date;

    if(page === 1){
      this.pageIndex = 0;
    }
    let url = `discover/movie?page=${page}&sort_by=${sort.code}`;
    if(date.start && date.end && date.start !== 'Invalid date' && date.end !== 'Invalid date'){
      url += `&primary_release_date.gte=${date.start}&primary_release_date.lte=${date.end}`;
    }

    let total:number = 0;
    this.apiService
      .getDataApi(url)
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        let favoriteAdded = res.results;
        favoriteAdded.forEach((movie:IMovie, index:number) => {
          const favIndex = this.dataFavorites.findIndex((fav:IMovie) => fav.id === movie.id);
          if(favIndex >= 0){
            favoriteAdded[index]['isFavorite'] = true;
          }
        })
        this.dataMovies = favoriteAdded;
        total = res.total_results > 10000 ? 10000 : res.total_results;
        this.totalMovies = total
        this.loading = false;
      });
  }

  getFavorites() {
    const account_id = localStorage.getItem('account_id');
    let url = `account/${account_id}/favorite/movies`;
    this.apiService
      .getDataApi(url)
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        this.dataFavorites = res.results;
        this.loading = false;
        this.getMovies(this.page, this.activeSort, this.filterDate)
      });
  }

  getGenre() {
    let url = `genre/movie/list`;
    this.apiService
      .getDataApi(url)
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        this.dataGenres = res.genres;
        this.loading = false;
      });
  }

  handlePageEvent(e:any){
    this.getMovies((e.pageIndex+1), this.activeSort, this.filterDate)
  }

}
