import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly unSubs = new Subject<any>();
  private loading: boolean = true;
  private page: number = 1;
  private filterDate: Partial<IDate> = {};
  public pageIndex: number = 0;
  public accountId: number = 0;
  public dataMovies: IMovie[] = [];
  public dataGenres: IGenre[] = [];
  public totalMovies: number = 0;
  public activeSort: ISort = {
    code:'popularity.desc',
    title: 'Popularity: Highest'
  };
  public sortList: ISort[] = [
    {
      code:'popularity.desc',
      title: 'Popularity: Highest'
    },
    {
      code:'popularity.asc',
      title: 'Popularity: Lowest'
    },
    {
      code:'release_date.desc',
      title: 'Release Date: Latest'
    },
    {
      code:'release_date.asc',
      title: 'Release Date: Oldest'
    },
    {
      code:'vote_count.desc',
      title: 'Vote Count: Highest'
    },
    {
      code:'vote_count.asc',
      title: 'Vote Count: Lowest'
    }
  ];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      let approved = params['approved'];
      if(approved){
        this.getUserAccount()
      }
  });
    this.getGenre()
    this.getDataUser(this.page, this.activeSort.code, this.filterDate)
  }
  ngOnInit(): void {
  }

  getUserAccount() {
    this.apiService
      .getDataApi('account')
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        this.accountId = res.id
        localStorage.setItem('account_id', res.id);
      });
  }
  createSession() {
    this.apiService
      .getDataApi('authentication/token/new')
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        window.open(`https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=http:localhost:4200`);
      });
  }
  applyFilter(type:string) {
    if(type === 'apply'){
      const startDate = moment(this.range.value.start)
      const endDate = moment(this.range.value.end)
      const start = startDate.format('YYYY[-]MM[-]DD');
      const end = endDate.format('YYYY[-]MM[-]DD');
      const obj = {
        start:start,
        end:end
      }
      this.filterDate = obj;
      this.getDataUser(this.page, this.activeSort.code, this.filterDate)
    } else {
      this.range.reset();
      // reset page masih error
      this.pageIndex = 0;
      this.activeSort = {
        code:'popularity.desc',
        title: 'Popularity: Highest'
      }
      this.getDataUser(this.pageIndex+1, this.activeSort.code, {})
    }
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
  getDataUser(page: number, sort: string, date: Partial<IDate>) {
    let url = `discover/movie?page=${page}&sort_by=${sort}`;
    if(date.start && date.end && date.start !== 'Invalid date' && date.end !== 'Invalid date'){
      url += `&sort_by=${sort}&primary_release_date.gte=${date.start}&primary_release_date.lte=${date.end}`;
    }

    this.apiService
      .getDataApi(url)
      .pipe(takeUntil(this.unSubs))
      .subscribe((res: any) => {
        this.dataMovies = res.results;
        const total = res.total_results > 10000 ? 10000 : res.total_results;
        this.totalMovies = total
        this.loading = false;
      });
  }

  handlePageEvent(e:any){
    this.getDataUser((e.pageIndex+1), this.activeSort.code, this.filterDate)
  }
}
