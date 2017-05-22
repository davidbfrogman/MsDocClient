import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ResourceImageQueueItem } from 'models';

@Injectable()
export class ResourceQueueEventBus {
    public queue: Array<ResourceImageQueueItem>

    private imageAddedSource = new Subject<ResourceImageQueueItem>();
    private retryImageSource = new Subject<ResourceImageQueueItem>();
    private imageCompletedSource = new Subject<ResourceImageQueueItem>();
    
    public imageAdded$ = this.imageAddedSource.asObservable();
    public retryImage$ = this.retryImageSource.asObservable();
    public imageCompleted$ = this.imageCompletedSource.asObservable();

    public addImage(queueItem: ResourceImageQueueItem) {
        if (!this.queue) {
            this.queue = new Array<ResourceImageQueueItem>();
        }
        this.queue.push(queueItem);
        this.imageAddedSource.next(queueItem);
    }

    public retryImage(queueItem: ResourceImageQueueItem) {
        if (this.isQueueItemsEqual(queueItem, this.queue[0])) {
            // If first in queue
            this.retryImageSource.next(queueItem);
        }
        else {
            // Mark for retryReady
            const itemInQueue = this.queue.find((value) => {
                return this.isQueueItemsEqual(queueItem, value);
            });
            itemInQueue.retryReady = true;
        }
    }

    public imageCompleted(queueItem: ResourceImageQueueItem) {
        this.removeFromQueue(queueItem);

        this.imageCompletedSource.next(queueItem);
        
        if(this.queue.length > 0 && this.queue[0].retryReady) {
            this.retryImageSource.next(this.queue[0]);
        }
    }

    private removeFromQueue(queueItem: ResourceImageQueueItem) {
        const indexOfItemToRemove = this.queue.findIndex((value) => {   
            return this.isQueueItemsEqual(queueItem, value);
        });
        if (indexOfItemToRemove > -1) {
            this.queue.splice(indexOfItemToRemove, 1);
        }
    }

    public isQueueItemsEqual(item1: ResourceImageQueueItem, item2: ResourceImageQueueItem) {
        return (item1.pid === item2.pid && 
          item1.conversion === item2.conversion);
    }
}