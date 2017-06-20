// Should be all uppercase

export class Constants {
    public static SOHO_DATEPICKER_DATE_FORMAT: string = 'yyyy-MM-dd';
    public static MOMENT_FORM_DATE_FORMAT: string = 'YYYY-MM-DD';
    public static MOMENT_API_DATE_FORMAT: string = 'YYYY-MM-DD';

    public static SOHO_DATEPICKER_TIME_FORMAT: string = 'HH:mm:ss';
    public static MOMENT_FORM_TIME_FORMAT: string = 'HH:mm:ss';
    public static MOMENT_API_TIME_FORMAT: string = 'HH:mm:ss[Z]';

    public static SOHO_DATEPICKER_DATETIME_FORMAT: string = 'yyyy-MM-dd HH:mm:ss';
    public static MOMENT_FORM_DATETIME_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';
    public static MOMENT_API_DATETIME_FORMAT: string = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

    public static SEARCH_INITIAL_XQUERY: string = '/MDS_GenericDocument';
    public static SEARCH_QUERY_CHECKOUT_BY_ME = '/MDS_File';
    public static SEARCH_QUERY_CREATED_BY_ME = '/MDS_GenericDocument';
    public static SEARCH_PAGE_SIZE: number = 5;
    public static TEMPLATE_ATTRIBUTE_ID = 'MDS_ID';
    public static TEMPLATE_ATTRIBUTE_NAME = 'MDS_TemplateName';
    public static TEMPLATE_ATTRIBUTE_DESCRIPTION = 'MDS_TemplateDetails';

    public static RESOURCE_SERVICE_CACHE_TAG: string = 'ResourceService';
    public static ITEM_SERVICE_CACHE_TAG: string = 'ItemService';

    // Configuration
    public static PROP_CONNECTION_USERNAME = 'Username';
    public static SEARCH_RESULT_PAGE_SIZE = 'SearchResultPageSize';

    // Result list available properties
    public static ITEM_PROP_ID = 'id';
    public static ITEM_PROP_PID = 'pid';
    public static ITEM_PROP_VERSION = 'version';
    public static ITEM_PROP_ENTITY_NAME = 'entityName';
    public static ITEM_PROP_CREATED_BY = 'createdBy';
    public static ITEM_PROP_CREATED_TS = 'createdTS';
    public static ITEM_PROP_CHECKEd_OUT_BY = 'checkedOutBy';
    public static ITEM_PROP_CHECKED_OUT_TS = 'checkedOutTS';
    public static ITEM_PROP_LAST_CHANGED_BY = 'lastChangedBy';
    public static ITEM_PROP_LAST_CHANGED_TS = 'lastChangedTS';
    public static ITEM_PROP_SIZE = 'size';
    public static ITEM_PROP_DISPLAY_NAME = 'displayName';
    public static ITEM_PROP_FILENAME = 'filename';
    public static ITEM_PROP_ITEMID = 'itemid';
    public static RESULT_LIST_DEFAULT_PROPS = ['prop:entityName', 'prop:createdBy', 'prop:createdTS', 'prop:lastChangedTS'];

    public static LOCALE_DEFAULT_LOCALE = 'en';
}

export class TranslationConstants {

//  TO DO TranslationConstants - send for translation

    public static MAIN_WINDOW_TAB_CONTROL_CENTER: string = 'MainWindowTabControlCenter';
    public static EDIT: string = 'Edit';
    public static REMOVE: string = 'Remove';
    public static TEMPLATES: string = 'Templates';

    // PreLoading
    public static LOADING: string = 'AnnotationsLoading';
    public static FAILED: string = 'Failed';
    public static LOGIN_FAILED: string = 'LoginFailed';
    public static LOGIN_FAILED_MESSAGE: string = 'FailedToLogin'; // Short message
    public static LOGIN_FAILED_TRY_AGAIN_MESSAGE: string = 'LoginFailedTry'; // Longer message

    // Client
    public static MAIN_WINDOW_TAB_DOCUMENTS: string = 'MainWindowTabDocuments';
    public static NEW_DOCUMENT_TAB: string = 'NewDocumentTab';

    // App
    public static OK: string = 'OK';
    public static OPEN: string = 'Open';
    public static CANCEL: string = 'AnnotationsCancelNote';
    public static YES: string = 'Yes';
    public static NO: string = 'No';
    public static SAVE_CHECK_IN: string = 'SaveCheckin';
    public static SAVE: string = 'SaveItem';
    public static DISCARD: string = 'Discard'; // unused?
    public static DISCARD_CHECK_OUT: string = 'DiscardCheckOut';
    public static FORCE_DISCARD_CHECK_OUT_MESSAGE: string = 'ForceDiscardCheckoutQuestion';
    public static FORCE_DISCARD_CHECK_OUT_MULTIPLE_DOCS_MESSAGE: string = 'DiscardCheckoutMultipleDocsQuestion';
    public static DISCARD_ANY_LOCAL_CHANGES_MESSAGE: string = 'DiscardAnyLocalChanges';
    public static OPERATION_ERROR: string = 'Error';
    public static SHOW_DETAILS_ERROR: string = 'ShowDetailsError';
    public static HIDE_DETAILS_ERROR: string = 'HideDetailsError';
    public static FORCE_CHECK_IN_TITLE: string = 'hdrForceCheckIn';
    public static FORCE_CHECK_IN_MESSAGE: string = 'ForceCheckInQuestion'; // Short message
    public static FORCE_CHECK_IN_LOCAL_CHANGES_MESSAGE: string = 'AnyLocalChanges'; // Description message
    public static DELETE_DOCUMENT_TITLE: string = 'DeleteItemTitle';
    public static DELETE_DOCUMENT_MESSAGE: string = 'DeleteDocument';
    public static DELETE_DOCUMENTS_MESSAGE: string = 'DeleteDocuments';
    public static OPEN_LATEST_VERSION_TITLE: string = 'OpenLatestVersion';
    public static OPEN_LATEST_VERSION_MESSAGE: string = 'DoYouOpenLatestVersion';
    public static OPEN_LATEST_VERSION_NEWER_MESSAGE: string = 'NewerVersionAvailable';
    public static SAVE_CHANGES_TITLE: string = 'SaveChanges';
    public static SAVE_CHANGES_MESSAGE: string = 'SaveYourChanges';
    public static SAVE_CHANGES_CHECK_IN_MESSAGE: string = 'DoYouWantToSave';
    public static CHECK_IN_TITLE: string = 'hdrCheckIn';
    public static CHECK_IN_MESSAGE: string = 'CheckInQuestion';
    public static OPERATION_FAILED_FOR: string = 'OperationFailedFor';

    // Search form
    public static NEW_DOCUMENT: string = 'NewDocument';
    public static ADD_NEW_DOCUMENT: string = 'AddNewDocument';
    public static FREE_TEXT_SEARCH: string = 'FreeTextSearch';
    public static SELECT_DOCUMENT_TYPES: string = 'DocumentTypes';
    public static SELECT_ATTRIBUTE: string = 'SelectAttribute';
    public static SELECT_OPERATION: string = 'Operation';
    public static VALUE: string = 'Value';
    public static RESET: string = 'Reset';
    public static SEARCH: string = 'Search';
    public static EXTEND_QUERY: string = 'ExtendQuery';
    public static SHORTCUTS: string = 'ExpanderShortcuts';
    public static CHECKED_OUT_BY_ME: string = 'CheckedOutByMe';
    public static CREATED_BY_ME: string = 'MyCreated';
    public static ADVANCED: string = 'tabAdvanced';
    public static QUERY: string = 'capQuery';
    public static INVALID_FREETEXT_VALUE: string = 'InvalidTextSearch';

    public static OPERATION_EQUAL: string = 'OperationEqual';
    public static OPERATION_NOT_EQUAL: string = 'OperationNotEqual';
    public static OPERATION_LIKE: string = 'OperationLike';
    public static OPERATION_NOT_LIKE: string = 'OperationNotLike';
    public static OPERATION_NO_VALUE: string = 'OperationNoValue';
    public static OPERATION_HAS_VALUE: string = 'OperationHasValue';
    public static OPERATION_LESS_THAN: string = 'OperationLessThan';
    public static OPERATION_GREATER_THAN: string = 'OperationGreaterThan';
    public static OPERATION_LESS_EQUAL: string = 'OperationLessEqual';
    public static OPERATION_GREATER_EQUAL: string = 'OperationGreaterEqual';
    public static OPERATION_BEFORE: string = 'OperationBefore';
    public static OPERATION_AFTER: string = 'OperationAfter';
    public static OPERATION_BEFORE_EQUAL: string = 'OperationBeforeEqual';
    public static OPERATION_AFTER_EQUAL: string = 'OperationAfterEqual';

    // Tooltips in search form
    public static FIELD_REQUIRED: string = 'FieldRequired';
    public static INVALID_VALUE: string = 'InvalidValue';
    public static TIME_FORMAT: string = 'TimeFormat';
    public static DATE_FORMAT: string = 'DateFormat';
    public static DATE_TIME_FORMAT: string = 'DateTimeFormat';
    public static MUST_BE_NUMBER: string = 'MustBeNumber';
    public static MUST_BE_NUMBER_DECIMAL: string = 'MustBeNumberDecimal';
    public static MAX_LENGTH: string = 'MaxLength';

    // Search item
    public static CLICK_TO_ADD: string = 'ClickToAdd';
    public static TAB_PROPERTIES: string = 'tabProperties';
    public static TAB_ATTRIBUTES: string = 'tabAttributes';
    public static FILE: string = 'File';
    public static FILE_NAME: string = 'FileName';
    public static INTERNAL_ID: string = 'InternalID';
    public static TAB_SECURITY: string = 'tabExtended';
    public static VERSIONS: string = 'Versions';
    public static VERSION: string = 'Version';
    public static HISTORY: string = 'History';
    public static ID: string = 'ID';
    public static PID: string = 'PID';
    public static CHECKED_OUT_TIMESTAMP: string = 'CheckedOutTS';
    public static LAST_CHANGED_BY: string = 'LastChangedBy';
    public static ACCESS_CONTROL_LIST: string = 'AccessControlList';
    public static DEFAULT_ACL: string = 'Default';
    public static SIZE: string = 'Size';
    public static DISPLAYNAME: string = 'DisplayName';
    public static MIME_TYPE: string = 'MIMEType';
    public static SELECT_ITEM: string = 'SelectItem';
    public static REMOVE_COLLECTION: string = 'RemoveCollection';
    public static ADD_COLLECTION: string = 'AddCollection';
    public static TEMPLATE_NAME: string = 'TemplateName';
    public static TEMPLATE_DETAILS: string = 'TemplateDetails';
    public static ENABLE_TEMPLATE: string = 'EnableTemplate';
    public static DISABLE_TEMPLATE: string = 'DisableTemplate';
    public static CLEAR_TEMPLATE_MESSAGE: string = 'ClearTemplateMessage';
    public static COPY_MESSAGE: string = 'CopyMessage';
    public static UNDO_CHECKOUT: string = 'UndoCheckout';
    public static UNDO_CHECKOUT_WARNING_MESSAGE: string = 'UndoCheckoutWarningMessage';
    public static REFRESH_ITEM: string = 'RefreshItem';


    // Search item version
    public static REVERT_VERSION: string = 'RevertVersion';
    public static VERSION_TITLE: string = 'VersionTitle';

    // Search result
    public static DOCUMENTS_MATCHING_SEARCH: string = 'DocumentsMatchingSearch';
    public static SORT_BY: string = 'SortBy';
    public static SELECT_SORTING: string = 'SelectSorting';
    public static ASCENDING: string = 'SortByAscending';
    public static DESCENDING: string = 'SortByDescending';
    public static BUTTON_DETAILS: string = 'MenuDetails';
    public static BUTTON_THUMBNAILS: string = 'MenuThumbnails';
    public static BUTTON_CARDS: string = 'MenuCard';
    public static ENTITY_NAME: string = 'EntityName';
    public static CREATED_BY: string = 'CreatedBy';
    public static CREATED_TIMESTAMP: string = 'CreatedTS';
    public static LAST_CHANGED_TIMESTAMP: string = 'LastChangedTS';
    public static CHECKED_OUT_BY: string = 'CheckedOutBy';
    public static NO_NAME: string = 'NoName';
    public static DISPLAY: string = 'Display';
    public static CHECK_IN: string = 'CheckIn';
    public static CHECK_OUT: string = 'CheckOut';
    public static DOWNLOAD: string = 'Download';
    public static DELETE: string = 'DeleteItem';
    public static COPY: string = 'CopyItem';
    public static BEGIN: string = 'Begin';
    public static BACK: string = 'Back';
    public static PAGE: string = 'Page';
    public static OF: string = 'Of';
    public static FORWARD: string = 'Forward';
    public static END: string = 'End';
    public static SELECT_ALL: string = 'SelectAll';
    public static SELECT_A_DOCUMENT_TYPE = 'SelectADocType';
    public static DOWNLOAD_PDF: string = 'DownloadPdf';
    public static PRINT: string = 'Print';
    public static SAVE_TO_IDM: string = 'SaveToIdm';

    // Pagination
    public static FIRST_PAGE: string = 'FirstPage';
    public static PREVIOUS_PAGE: string = 'PreviousPage';
    public static NEXT_PAGE: string = 'NextPage';
    public static LAST_PAGE: string = 'LastPage';

    // Tabs
    public static CLOSE: string = 'MenuItemClose';
    public static MORE: string = 'More';
    public static CHANGES_IN_CC_MESSAGE: string = 'ChangesInCCMessage';
    public static RELOAD_CLIENT: string = 'ReloadClient';
    public static RELOAD_CLIENT_MESSAGE: string = 'ReloadClientMessage';

    // Web Part - Related Information
    public static ADD: string = 'Add';
    public static ALL: string = 'All';
    public static PICTURE_VIEW: string = 'PictureView';
    public static LIST_VIEW: string = 'ListView';
    public static NO_RESULTS_FOUND: string = 'NoResultsFound';
    public static ADD_FILE: string = 'AnnotationsAddFile';
    public static CONTEXT: string = 'Context';
    public static ADDITIONAL_DETAILS: string = 'AdditionalDetails';
    public static SELECT_DOCUMENT_TYPE: string = 'SelectADocumentType';
    public static UPLOAD: string = 'Upload';
    public static SHOW_IN_IDM: string = 'ShowInIDM';
    public static SHARE: string = 'Share';
    public static UNKNOWN_ERROR: string = 'AnnotationsError';
    public static NO_DOCUMENT_TYPES_COULD_BE_ADDED: string = 'NoDocumentTypesCouldBeAdded';

    // Workflow
    public static WORKFLOW_START_NAME: string = 'WorkflowStartName';
    public static WORKFLOW_STARTED_TITLE: string = 'WorkflowStartedTitle';
    public static WORKFLOW_STARTED_DETAIL: string = 'WorkflowStartedDetail';
    public static WORKFLOW_SELECT_TITLE: string = 'WorkflowSelectTitle';

    // Add new document
    public static BLANK_DOCUMENT: string = 'BlankDocument';
    public static CREATE_BLANK_DOCUMENT: string = 'CreateBlankDocument';
    public static CREATE_DOCUMENT: string = 'CreateDocument';

    // Error messages
    public static ERROR_RETRIEVE_ITEM: string = 'ErrorApiRetrieveItem';
    public static ERROR_INVALID_NUMBER: string = 'ErrorInvalidNumber';
    public static ERROR_INVALID_TIME: string = 'ErrorInvalidTime';
    public static ERROR_STRING_LONG: string = 'ErrorStringLong';
}
