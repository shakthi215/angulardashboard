import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatTooltipModule, MatButtonModule],
  exports: [CommonModule, MatTooltipModule, MatButtonModule],
})
export class SharedModule {}
