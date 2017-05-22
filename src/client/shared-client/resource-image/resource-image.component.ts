import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Item, ResourceData, ResourceImageQueueItem } from 'models';
import { ResourceService } from 'services';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ResourceDataUtility } from 'utility';
import { ErrorEventBus, ResourceQueueEventBus } from 'event-buses';
import { SohoBusyIndicatorDirective } from '@infor/sohoxi-angular';

@Component({
  selector: 'idm-resource-image',
  templateUrl: './resource-image.component.html',
  styleUrls: ['./resource-image.component.scss'],
  providers: [ResourceService]
})
export class ResourceImageComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() type: string;
  @Input() useQueue: boolean = false;
  @ViewChild(SohoBusyIndicatorDirective) busyIndicator: SohoBusyIndicatorDirective;

  public imgUrl: SafeUrl;
  private retryCount: number = 0;
  private retryMax: number = 3;
  private queueItem: ResourceImageQueueItem;

  constructor(
    private resourceService: ResourceService,
    private sanitizer: DomSanitizer,
    private errorEventBus: ErrorEventBus,
    private resourceQueueEventBus: ResourceQueueEventBus
  ) { }

  ngOnInit() {
    if (this.item && this.item.resrs) {
      if (this.useQueue) {
        this.initSubscriptions();
        this.queueItem = new ResourceImageQueueItem(this.item.pid, this.type);
        this.resourceQueueEventBus.addImage(this.queueItem);
      } else {
        this.fetch();
      }
    }
  }

  ngAfterViewInit() {
    if (this.item && this.item.resrs) {
      this.busyIndicator.activated = true;
    }
  }

  public fetch() {
    this.resourceService.getResourceStream(this.item.pid, this.type)
    .subscribe((resource: ResourceData) => {
      this.setImage(resource);

      if (resource.httpStatus === 200) {
        this.resourceReady();
      } else {
        if (this.useQueue) {
          this.resourceQueueEventBus.retryImage(this.queueItem);
        } else {
          this.retryFetch();
        }
      }
    }, error => {
      this.handleError(error);
    });
  }

  public retryFetch() {
    this.resourceService.getResourceStream(this.item.pid, this.type)
    .subscribe((resource: ResourceData) => {
      this.retryCount++;

      this.setImage(resource);

      if (resource.httpStatus === 200 || this.retryCount >= this.retryMax) {
        this.resourceReady();
      }

      if (resource.httpStatus !== 200 && this.retryCount < this.retryMax) {

        // Try again in 3 seconds
        setTimeout(() => {
          this.retryFetch();
        }, 3000);
      }

    }, error => {
      this.handleError(error);
    });
  }

  private setImage(resource: ResourceData) {
    const objectUrl = ResourceDataUtility.createObjectUrl(resource);
    // The sanitizer might be removed when routing is correctly set up
    this.imgUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  private handleError(error) {
    this.resourceReady();
    this.errorEventBus.throw(error);
  }

  private resourceReady() {
    this.busyIndicator.activated = false;
    if (this.useQueue) {
      this.resourceQueueEventBus.imageCompleted(this.queueItem);
    }
  }

  private initSubscriptions() {
    this.resourceQueueEventBus.imageAdded$.subscribe((queueItem) => {
      if (this.resourceQueueEventBus.isQueueItemsEqual(queueItem, this.queueItem)) {
        this.fetch();
      }
    });

    this.resourceQueueEventBus.retryImage$.subscribe((queueItem) => {
      if (this.resourceQueueEventBus.isQueueItemsEqual(queueItem, this.queueItem)) {
        this.retryFetch();
      }
    });
  }
}
