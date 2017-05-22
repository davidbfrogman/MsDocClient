export abstract class BaseModel {
    // Usage here: myItem = Item.convertToClass<Item>(item,Item);
    // Note the last parameter to this method is actually a class type; in the example above 'Item'
    public static convertToClass<T>(obj: Object, typeOfClass: {new() : T}): T {
        const newObj = new typeOfClass();
        for (const i in obj) {
            newObj[i] = obj[i];
        }
        return newObj;
    }

    constructor() {}

    public getJSON(): string {
        // TODO: Implement a better version of toJSON here
        return JSON.stringify(this);
    }
}
