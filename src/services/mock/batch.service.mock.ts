import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { CacheEventBus } from 'event-buses';
import { BatchService } from 'services';
import { Item, BatchOperations, BatchOperation } from 'models';
import { BatchOperationsData } from 'services/mock';


@Injectable()
export class BatchServiceMock extends BatchService {
    constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
        super(http, cacheEventBus);
    }

    public checkOutItems(items: Item[]): Observable<BatchOperation[]> {
        const ops: BatchOperation[] = BatchOperationsData.batchOperations.batchOperation;
        return Observable.of(ops);
    }

    public checkInItems(items: Item[]): Observable<BatchOperation[]> {
        const ops: BatchOperation[] = BatchOperationsData.batchOperations.batchOperation;
        return Observable.of(ops);
    }

    public copyItems(items: Item[]): Observable<BatchOperation[]> {
        const ops: BatchOperation[] = BatchOperationsData.batchOperations.batchOperation;
        return Observable.of(ops);
    }

    public deleteItems(items: Item[]): Observable<BatchOperation[]> {
        const ops: BatchOperation[] = BatchOperationsData.batchOperations.batchOperation;
        return Observable.of(ops);
    }

    public retrieveItems(items: Item[]): Observable<BatchOperation[]> {
        const ops: BatchOperation[] = BatchOperationsData.batchOperations.batchOperation;
        return Observable.of(ops);
    }

    public undoCheckOutItems(items: Item[]): Observable<BatchOperation[]> {
        const ops: BatchOperation[] = BatchOperationsData.batchOperations.batchOperation;
        return Observable.of(ops);
    }
}
