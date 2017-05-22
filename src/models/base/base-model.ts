export abstract class BaseModel {
    constructor(){}

    public getJSON() : string{
        //TODO: Implement a better version of toJSON here
        return JSON.stringify(this);
    }

    //Usage here: myItem = Item.convertToClass<Item>(item,Item);
    //Note the last parameter to this method is actually a class type; in the example above 'Item'
    public static convertToClass<T>(obj : Object, typeOfClass : {new() : T}) : T{
        let newObj = new typeOfClass();
        for(var i in obj){
            newObj[i] = obj[i];
        }
        return newObj;
    }
}