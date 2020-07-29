import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-section-theme',
  templateUrl: './section-theme.component.html',
  styleUrls: ['./section-theme.component.css']
})
export class SectionThemeComponent implements OnInit {

  idTheme: number;

  constructor(private authService: AuthService, private themeService: ThemeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.idTheme = this.route.snapshot.params['id'];
  }

  getIsAuth() {
     return this.authService.getIsAuth();
  }

  getIdTheme() {
     this.idTheme = this.route.snapshot.params['id']; // il faut actualiser l'idTheme avant
     return this.idTheme;
  }

  getImage() {
      return this.themeService.getImageTheme(this.route.snapshot.params['id']);
  }

}
