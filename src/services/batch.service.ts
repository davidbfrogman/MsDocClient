import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { CacheEventBus } from 'event-buses';

import { BaseService } from 'services';
import { BatchOperation, BatchOperations, Item } from 'models';
import { BatchOperationType } from 'enumerations';

@Injectable()
export class BatchService extends BaseService<BatchOperations> {

    constructor(protected http: Http, protected cacheEventBus: CacheEventBus) {
        super(http, BatchOperations, {
            rootApiUrl: environment.restUrls.ca,
            urlSuffix: 'items',
            urlSuffixPlural: 'items',
            encodeId: true,
            listUsesPlural: false,
            cacheConfig: {
                tag: 'BatchService',
                isCacheable: false
            }
        }, cacheEventBus);
    }

    public checkOutItems(items: Item[]): Observable<BatchOperation[]> {
        const batchOperations: BatchOperations = this.createBatchOperations(BatchOperationType.CHECKOUT_ITEM, items);
        return this.postBatch(batchOperations);
    }

    public checkInItems(items: Item[]): Observable<BatchOperation[]> {
        const batchOperations: BatchOperations = this.createBatchOperations(BatchOperationType.CHECKIN_ITEM, items);
        return this.postBatch(batchOperations);
    }

    public copyItems(items: Item[]): Observable<BatchOperation[]> {
        const batchOperations: BatchOperations = this.createBatchOperations(BatchOperationType.COPY_ITEM, items);
        return this.postBatch(batchOperations);
    }

    public deleteItems(items: Item[]): Observable<BatchOperation[]> {
        const batchOperations: BatchOperations = this.createBatchOperations(BatchOperationType.DELETE_ITEM, items);
        return this.postBatch(batchOperations);
    }

    public retrieveItems(items: Item[]): Observable<BatchOperation[]> {
        const batchOperations: BatchOperations = this.createBatchOperations(BatchOperationType.RETRIEVE_ITEM, items);
        return this.postBatch(batchOperations);
    }

    public undoCheckOutItems(items: Item[]): Observable<BatchOperation[]> {
        const batchOperations: BatchOperations = this.createBatchOperations(BatchOperationType.UNDO_CHECKOUT_ITEM, items);
        return this.postBatch(batchOperations);
    }

    private postBatch(batch: BatchOperations): Observable<BatchOperation[]> {
        const url = this.buildUrl({ operation: 'batch', query: { '$useTransaction': false, '$throwOnException': false } });
        const body = { batch };
        return this.http.post(url, body, this.reqOptions).map((res: Response) => {
            const responseObject = res.json();
            const data: BatchOperation[] = responseObject[Object.keys(responseObject)[0]]['batchOperation'];
            return data;
        })
            .catch(this.handleError);
    }

    /**
     * Creates a BatchOperations object of specified type for all items.
     * Each item will be in it's own BatchOperation.
     * Note: it's also possible to put all items in one BatchOperation,
     * but then individual error messages for each item won't be returned from backend.
     */
    private createBatchOperations(type: BatchOperationType, items: Item[]): BatchOperations {
        const operations: BatchOperation[] = [];
        items.forEach(item => {
            const operation: BatchOperation = new BatchOperation(type, { item });
            operations.push(operation);
        });

        return <BatchOperations>{ batchOperation: operations };
    }
}
