import { Subject } from 'rxjs/Subject';
import { BehaviorSubject, Observable } from 'rxjs';

export class EditionService {

    isModeEditionSubject = new Subject<boolean>();
    private isModeEdition: boolean;

    emitIsModeEditionSubject() {
        this.isModeEditionSubject.next(this.isModeEdition);
    }

    activerModeEdition() {
        this.isModeEdition = true;
        console.log('activation mode edition');
        this.emitIsModeEditionSubject();
    }

    desactiverModeEdition() {
            this.isModeEdition = false;
            console.log('désactivation mode edition');
            this.emitIsModeEditionSubject();
        }

}
