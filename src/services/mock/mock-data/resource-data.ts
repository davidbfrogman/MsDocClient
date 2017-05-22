import { Response, ResponseOptions, Headers } from "@angular/http";
import { ResourceData } from 'models';

const headers = new Headers();
headers.set("Content-Disposition", "inline; filename=\"Preview.png\"; filename*=UTF-8''Preview.png");
headers.set("Content-Type", "image/png");
/**
 * Mock of a resource file response (stream methods)
 */
export const ResourceResponse = new Response(new ResponseOptions({
    body: new ArrayBuffer(8),
    status: 200,
    headers: headers
}));

export const ResourceResponseNotReady = new Response(new ResponseOptions({
    body: new ArrayBuffer(8),
    status: 202,
    headers: headers
}));

export const ResourceData200 = <ResourceData> {
    httpStatus: 200,
    filename: "Preview.png",
    mimeType: "image/png",
    data: new ArrayBuffer(8)
};

export const ResourceData202 = <ResourceData> {
    httpStatus: 202,
    filename: "Preview.png",
    mimeType: "image/png",
    data: new ArrayBuffer(8)
};