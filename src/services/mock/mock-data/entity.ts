const Attribute = {
  name: 'MDS_EntityType',
  desc: 'Entity Type',
  type: '1',
  qual: 'MDS_EntityType',
  required: 'false',
  unique: 'false',
  searchable: 'false',
  repr: 'false'
};

export const EntityData = {
  id: '1',
  caseSensitive: 'false',
  classification: '2',
  comprehensiveAttributes: undefined,
  defaultAcl: 'Public',
  defaultAttributes: undefined,
  defAclRadio: 'what\'s that??',
  desc: 'Document',
  entities: undefined,
  entity: undefined,
  externalIdEnabled: 'true',
  isComprehensiveAttrBuilt: false,
  isDefaultAttrBuilt: false,
  isMultiValueAttrBuilt: false,
  multiValueAttributes: undefined,
  mv: 'what\'s that???',
  name: 'MDS_GenericDocument',
  originalId: '1',
  representsItem: 'some item',
  reprItem: 'some item',
  resEnabled: 'true',
  root: 'true',
  search: 'false',
  templateEnabled: 'true',
  title: 'Testing Entity',
  versionEnabled: 'true',
  versioning: 'true',
  acls: {
    acl: [
      { name: "Public" }, 
      { name: "Private" }
    ]
  },
  attrs: {
    attr: [
      Attribute
    ]
  },
  attributes: [
    Attribute
  ],
  getJSON: () => {
    return 'Testing Entity';
  }
};