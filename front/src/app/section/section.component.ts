import { Component, OnInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EditionService } from '../services/edition.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  idTheme: number;

  isModeEdition: boolean;
  isModeEditionSubscription : Subscription;

  constructor(private authService: AuthService,
              private editionService: EditionService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.idTheme = this.route.snapshot.params['id'];
      this.isModeEditionSubscription = this.editionService.isModeEditionSubject.subscribe(
                      (isModeEdition: boolean) => {
                                                     this.isModeEdition = isModeEdition;
                                                  });
      this.editionService.emitIsModeEditionSubject();
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
