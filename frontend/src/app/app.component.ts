import { Component, OnInit } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { ThemeService } from './core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading$!: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.init();
    this.isLoading$ = this.loadingService.isLoading$;
  }
}
