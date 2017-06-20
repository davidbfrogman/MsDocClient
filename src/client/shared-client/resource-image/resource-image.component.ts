import { Component, OnChanges, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Item, ResourceData } from 'models';
import { ResourceService } from 'services';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ResourceDataUtility } from 'utility';
import { ErrorEventBus } from 'event-buses';
import { SohoBusyIndicatorDirective } from '@infor/sohoxi-angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { SecurityContext } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'idm-resource-image',
  templateUrl: './resource-image.component.html',
  styleUrls: ['./resource-image.component.scss'],
  providers: [ResourceService]
})
export class ResourceImageComponent implements OnChanges {
  @Input() item: Item;
  @Input() type: string;
  // This is the index where the component sits amongst other resource image components.
  // So that means that when we have a big grid of these, each component will be aware where it is in relation
  // to other image resource components.  This is used later for the algorithm for how we fetch images from the server.
  @Input() index: number = 0;
  @ViewChild(SohoBusyIndicatorDirective) busyIndicator: SohoBusyIndicatorDirective;

  public imgUrl: SafeUrl;
  public numberOfRetries: number = 4; // Need one for the intial retry + 3 more actual retries.
  public delayBetweenRetries: number = 3000; // 3 second delay between trying again.
  public currentResourcesHash: string;

  constructor(
    private resourceService: ResourceService,
    private sanitizer: DomSanitizer,
    private errorEventBus: ErrorEventBus
  ) {
  }

  ngOnChanges() {
    if (this.item && this.item.resrs) {
      // We're only going to setup polling if the image has actually changed.  
      const hash = this.item.resrs.res[0].sha256;
      if (!this.currentResourcesHash ||
        this.currentResourcesHash !== hash) {
        this.currentResourcesHash = hash;
        this.initializePolling();
      }
    }
  }

  initializePolling() {
    // We're setting up an observable to that will emit events.
    // each time it emits an event, we're going to call the api to get the resource bytes
    // Here we're setting it up to try initially right away, then wait for 3 seconds before the next try
    // we try a max number of 4 times.  Basically I'm doing one initial try, plus 3 retries.
    // The algo here is to stagger the requests by frames of 10.  So the first 10 will fire right away.
    // the next ten will fire after 200ms and so on.
    const polling = Observable.timer(0 + (this.index * (Math.floor(this.index / 10) * 200)), this.delayBetweenRetries)
      .take(this.numberOfRetries)
      .subscribe(() => {

        // I couldn't get the busy indicator to work unless, I both activated it, and opened it.
        this.busyIndicator.open();
        this.busyIndicator.activated = true;

        // Every time the polling observable emits a value try and get the resource stream.
        return this.resourceService.getResourceStream(this.item.pid, this.type)
          .subscribe((resource: ResourceData) => {
            // If the stream returned with a status of 200, we're going to set the image, and
            // remove our subscription to the polling observable.
            if (resource.httpStatus === 200) {

              this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ResourceDataUtility.createObjectUrl(resource));

              // // I couldn't get the busy indicator to work unless, I both closed it, and deactivated it.
              this.busyIndicator.close(true);
              this.busyIndicator.activated = false;

              // This basically stops the outside observable, stopping it.
              // and ending our polling.
              polling.unsubscribe();
            }
          }, error => { this.errorEventBus.throw(error); });
      }, error => { this.errorEventBus.throw(error); });
  }

}
