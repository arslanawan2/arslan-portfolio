import { Injectable, signal } from '@angular/core';

/** Lets any component open the hire dialog without wiring inputs
 *  through the whole tree. */
@Injectable({ providedIn: 'root' })
export class HireDialogService {
  private readonly openState = signal(false);

  readonly isOpen = this.openState.asReadonly();

  open(): void {
    this.openState.set(true);
  }

  close(): void {
    this.openState.set(false);
  }
}
