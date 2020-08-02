import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  idTheme: number;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.idTheme = this.route.snapshot.params['id'];
  }

  ngOnChanges(): void {
      this.idTheme = this.route.snapshot.params['id'];
  }

  getIsAuth() {
      return this.authService.getIsAuth();
  }

  getIdTheme() {
      this.idTheme = this.route.snapshot.params['id'];
      return this.idTheme;
  }

}
