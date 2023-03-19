import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export interface ISort {
  code: string;
  title: string;
}
export interface IDate {
  start: string;
  end: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  activatedComponentReference!:HomeComponent
  private readonly unSubs = new Subject<any>();
  public events: string[] = [];
  public opened: boolean = false;
  private page: number = 1;
  private filterDate: Partial<IDate> = {};
  public pageIndex: number = 0;
  public accountId: number = 0;
  
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
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      let approved = params['approved'];
      if(approved){
        this.getUserAccount()
      }
  });
    
  }
  ngOnInit(): void {
  }

  onActivate(activatedComponentReference:any) {
    this.activatedComponentReference = activatedComponentReference;
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
      this.activatedComponentReference.getMovies(1, this.activeSort, this.filterDate)
    } else {
      this.range.reset();
      this.page = 1;
      this.activeSort = {
        code:'popularity.desc',
        title: 'Popularity: Highest'
      }
      const obj = {
        start:"",
        end:""
      }
      this.filterDate = obj;
      this.activatedComponentReference.getMovies(this.page, this.activeSort, this.filterDate)
    }
  }
  
}
