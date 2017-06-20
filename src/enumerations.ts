export enum OperationType {
  NotEqual = 1,
  EqualTo = 2,
  Before = 3,
  After = 4,
  BeforeOrEqual = 5,
  AfterOrEqual = 6,
  HasValue = 7,
  NoValue = 8,
  Like = 9,
  NotLike = 10,
  True = 11,
  False = 12
}

export enum SearchStyleType {
  String = 1,
  Boolean = 2,
  Date = 3,
  Timestamp = 4,
  Time = 5,
  MultiValue = 6,
  Valueset = 7,
  User = 8
}

export enum EnvironmentType {
  Dev = 1,
  QA = 2,
  Stage = 3,
  Prod = 4
}

export enum AttributeType {
    String = 1,
    Short = 2,
    Long = 3,
    Decimal = 4,
    Date = 5,
    Time = 6,
    Timestamp = 7,
    Double = 8,
    Boolean = 9,
    MultiValue = 10,
    GUID = 11,

    // Virtual type so we can calculate form value and api value
    Size = 12
}

export enum FormFieldType {
  String = 1,
  Number = 2,
  Boolean = 3,
  DatePicker = 4,
  TimePicker = 5,
  DateTimePicker = 6,
  MultiValue = 7,
  Dropdown = 8,
  User = 9
}

// Map item resource type from API
export const ItemResourceType = {
    Thumbnail: 'Thumbnail',
    SmallPreview: 'SmallPreview',
    Preview: 'Preview',
    Main: ''
};

export enum CacheEventType {
    Set = 1,
    Get = 2,
    RemoveAllByTag = 3,
    Clear = 4
}

export enum ConfigurationEventType {
    SetProperties = 1
}

export const enum CacheStorageType {
    Memory = 1,
}

export enum SearchResultListViewsType {
    Card = 1,
    Detail = 2,
    Thumbnail = 3
}

export enum ActionsType {
    Save = 1,
    Display = 2,
    CheckIn = 3,
    CheckOut = 4,
    DiscardCheckOut = 5,
    Download = 6,
    DownloadPdf = 7,
    SaveToIdm = 8,
    PrintPdf = 9,
    Delete = 10,
    Copy = 11,
    Refresh = 12,
    StartWorkflow = 13
}

export enum ActionViewsType {
    SearchResult = 1,
    Details = 2
}

export const MimeType = {
    JSON: 'application/json',
    TEXT: 'text/plain'
};

export enum BatchOperationType {
    ADD_ITEM = 0,
    UPDATE_ITEM = 1,
    RETRIEVE_ITEM = 2,
    RETRIEVE_ITEMS = 3,
    DELETE_ITEM = 4,
    DELETE_ITEMS = 5,
    CHECKIN_ITEM = 6,
    CHECKIN_ITEMS = 7,
    CHECKOUT_ITEM = 8,
    CHECKOUT_ITEMS = 9,
    SEARCH_ITEMS = 10,
    SEARCH_COUNT = 11,
    UNDO_CHECKOUT_ITEM = 12,
    UNDO_CHECKOUT_ITEMS = 13,
    COPY_ITEM = 14,
    COPY_ITEMS = 15
}
