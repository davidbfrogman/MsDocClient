import { ChangeDetectorRef } from '@angular/core';

export class ChangeDetectorRefMock implements ChangeDetectorRef {
  markForCheck = null;
  detach = null;
  detectChanges = null;
  checkNoChanges = null;
  reattach = null;
}
