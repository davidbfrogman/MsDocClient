export class ResourceImageQueueItem {
    public pid: string;
    public conversion: string;
    public retryReady: boolean;

    constructor(pid: string, conversion: string, retryReady: boolean = false) {
        this.pid = pid;
        this.conversion = conversion;
        this.retryReady = retryReady;
    }
}