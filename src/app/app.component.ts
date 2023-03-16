import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';
export interface IDate {
  start: string;
  end: string;
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
  private sort: string = 'popularity.desc';
  public pageIndex: number = 0;
  public dataMovies: IMovie[] = [];
  public totalMovies: number = 0;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private apiService: ApiService,
  ) {
    this.getDataUser(this.page, this.sort, this.filterDate)
  }
  ngOnInit(): void {

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
      this.getDataUser(this.page, this.sort, this.filterDate)
    } else {
      this.range.reset();
      // reset page masih error
      this.pageIndex = 0;
      this.getDataUser(this.pageIndex+1, 'popularity.desc', {})
    }
  }
  getDataUser(page: number, sort: string, date: Partial<IDate>) {
    let url;
    if(date.start && date.end){
      url = `discover/movie?page=${page}&sort_by=${sort}&primary_release_date.gte=${date.start}&primary_release_date.lte=${date.end}`;
    } else {
      url = `discover/movie?page=${page}&sort_by=${sort}`;
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
    this.getDataUser((e.pageIndex+1), this.sort, this.filterDate)
  }
}
