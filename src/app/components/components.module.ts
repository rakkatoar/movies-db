import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/module/material.module';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    CardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    CardComponent,
  ],
})
export class ComponentsModule {}
