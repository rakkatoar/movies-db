import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites.component';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { MaterialModule } from 'src/app/shared/module/material.module';
import { ComponentsModule } from 'src/app/components/components.module';
@NgModule({
  declarations: [
    FavoritesComponent,
  ],
  imports: [
    CommonModule,
    FavoritesRoutingModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class FavoritesModule { }
