import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie.component';
import { MovieRoutingModule } from './movie-routing.module';
import { MaterialModule } from 'src/app/shared/module/material.module';

@NgModule({
  declarations: [
    MovieComponent
  ],
  imports: [
    CommonModule,
    MovieRoutingModule,
    MaterialModule
  ],
  exports:[
    MovieComponent
  ]
})
export class MovieModule { }
