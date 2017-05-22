import { ResourceData } from 'models'
import { Response } from '@angular/http';

export class ResourceDataUtility {

    /**
     * Creates a ResourceData object from a response
     * @param response 
     */
    public static fromResponse(response: Response): ResourceData {
        let resource = new ResourceData();

        if(response.headers){
            resource.mimeType = response.headers.get("Content-Type");
            const contentDisposition = response.headers.get("Content-Disposition");
            if (contentDisposition != null) {
                const matchArr = contentDisposition.match(/filename="(.+)"/);
                if (matchArr.length >= 2) {
                    // Set filename if it's supplied in Content-Disposition
                    resource.filename = matchArr[1];
                }
            }
        }
        resource.httpStatus = response.status;
        resource.data = response.arrayBuffer();
        
        return resource;
    }

    /**
     * Returns an object URL from resource data
     * @param resource 
     */
    public static createObjectUrl(resource: ResourceData): string {
        const arrayBufferView = new Uint8Array( resource.data );
        const blob = new Blob( [ arrayBufferView ], { type: resource.mimeType } );

        const objectUrl = window.URL.createObjectURL(blob);
        return objectUrl;
    }
}