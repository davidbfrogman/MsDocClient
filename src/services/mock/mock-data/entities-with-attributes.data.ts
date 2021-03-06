export const EntitiesWithAttributes = {
   'entities': {
      'entity': [
         {
            'name': 'MDS_GenericDocument',
            'desc': 'Document',
            'root': 'true',
            'search': 'false',
            'resEnabled': 'true',
            'versionEnabled': 'true',
            'classification': '2',
            'defaultAcl': 'Public',
            'reprItem': 'filename',
            'attrs': {
               'attr': [
                  {
                     'name': 'MDS_EntityType',
                     'desc': 'Entity Type',
                     'type': '1',
                     'qual': 'MDS_EntityType',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_AccountingEntity',
                     'desc': 'Accounting Entity',
                     'type': '1',
                     'qual': 'MDS_AccountingEntity',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_Location',
                     'desc': 'Location',
                     'type': '1',
                     'qual': 'MDS_Location',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_id1',
                     'desc': 'id1',
                     'type': '1',
                     'qual': 'MDS_id1',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_BodRefNoun',
                     'desc': 'BOD Reference Noun',
                     'type': '1',
                     'qual': 'MDS_BodRefNoun',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_BodRefDocId',
                     'desc': 'BOD Reference Document Id',
                     'type': '1',
                     'qual': 'MDS_BodRefDocId',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_BodRefAccEntity',
                     'desc': 'BOD Reference Accounting Entity',
                     'type': '1',
                     'qual': 'MDS_BodRefAccEntity',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_BodRefLocation',
                     'desc': 'BOD Reference Location',
                     'type': '1',
                     'qual': 'MDS_BodRefLocation',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'MDS_BodRefRevisionId',
                     'desc': 'BOD Reference Revision Id',
                     'type': '1',
                     'qual': 'MDS_BodRefRevisionId',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  }
               ]
            },
            'acls': {
               'acl': [
                  {
                     'name': 'Private',
                     'desc': 'Only the last modifier of the item can read and edit'
                  },
                  {
                     'name': 'Public',
                     'desc': 'Open for all users to read and edit'
                  }
               ]
            }
         },

         {
            'name': 'MDS_File',
            'desc': 'File',
            'root': 'true',
            'search': 'false',
            'resEnabled': 'true',
            'versionEnabled': 'true',
            'classification': '2',
            'defaultAcl': 'Public',
            'reprItem': 'MDS_Name',
            'attrs': {
               'attr': [
                  {
                     'name': 'MDS_Name',
                     'desc': 'Name',
                     'type': '1',
                     'qual': 'MDS_Name',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'true'
                  },
                  {
                     'name': 'MDS_Status',
                     'desc': 'Status',
                     'type': '3',
                     'qual': 'MDS_Status',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'vsEntity': 'MDS_VS_Status',
                     'vsAttr': 'MDS_Status',
                     'valueset': {
                        'value': [
                           {
                              'name': '5',
                              'desc': 'Draft'
                           },
                           {
                              'name': '6',
                              'desc': 'In Review'
                           },
                           {
                              'name': '7',
                              'desc': 'Reviewed'
                           },
                           {
                              'name': '8',
                              'desc': 'For Approval'
                           },
                           {
                              'name': '9',
                              'desc': 'Rejected'
                           },
                           {
                              'name': '20',
                              'desc': 'Approved'
                           },
                           {
                              'name': '10',
                              'desc': 'Published'
                           },
                           {
                              'name': '80',
                              'desc': 'Invalid'
                           }
                        ]
                     }
                  }
               ]
            },
            'acls': {
               'acl': [
                  {
                     'name': 'Private',
                     'desc': 'Only the last modifier of the item can read and edit'
                  },
                  {
                     'name': 'Public',
                     'desc': 'Open for all users to read and edit'
                  }
               ]
            }
         },
         {
            'name': 'Daves_MV_Attribute_Doc',
            'desc': 'Daves_MV_Attribute_Doc',
            'root': 'true',
            'search': 'true',
            'resEnabled': 'true',
            'versionEnabled': 'true',
            'classification': '2',
            'defaultAcl': 'Public',
            'reprItem': 'filename',
            'attrs': {
               'attr': [
                  {
                     'name': 'DaveRegularAttribute',
                     'desc': 'DaveRegularAttribute',
                     'type': '1',
                     'qual': 'DaveRegularAttribute',
                     'default': 'Hello',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false',
                     'size': '128'
                  },
                  {
                     'name': 'MDS_TemplateName',
                     'desc': 'MDS_TemplateName',
                     'type': '1',
                     'qual': 'MDS_TemplateName',
                     'required': 'false',
                     'unique': 'true',
                     'searchable': 'true',
                     'repr': 'false',
                     'size': '128'
                  },
                  {
                     'name': 'MDS_TemplateDetails',
                     'desc': 'MDS_TemplateDetails',
                     'type': '1',
                     'qual': 'MDS_TemplateDetails',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false',
                     'size': '512'
                  },
                  {
                     'name': 'DavesBool',
                     'desc': 'DavesBool',
                     'type': '20',
                     'qual': 'DavesBool',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesDate',
                     'desc': 'DavesDate',
                     'type': '7',
                     'qual': 'DavesDate',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesDecimal',
                     'desc': 'DavesDecimal',
                     'type': '6',
                     'qual': 'DavesDecimal',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesDouble',
                     'desc': 'DavesDouble',
                     'type': '10',
                     'qual': 'DavesDouble',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesLong',
                     'desc': 'DavesLong',
                     'type': '4',
                     'qual': 'DavesLong',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesShort',
                     'desc': 'DavesShort',
                     'type': '3',
                     'qual': 'DavesShort',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false',
                     'max': '30',
                     'min': '1'
                  },
                  {
                     'name': 'DavesTime',
                     'desc': 'DavesTime',
                     'type': '8',
                     'qual': 'DavesTime',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesTimestamp',
                     'desc': 'DavesTimestamp',
                     'type': '9',
                     'qual': 'DavesTimestamp',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false'
                  },
                  {
                     'name': 'DavesValueset',
                     'desc': 'DavesValueset',
                     'type': '3',
                     'qual': 'DavesValueset',
                     'default': '5',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'true',
                     'repr': 'false',
                     'vsEntity': 'MDS_VS_Status',
                     'vsAttr': 'MDS_Status',
                     'valueset': {
                        'value': [
                           {
                              'name': '5',
                              'desc': 'Draft'
                           },
                           {
                              'name': '6',
                              'desc': 'In Review'
                           },
                           {
                              'name': '7',
                              'desc': 'Reviewed'
                           },
                           {
                              'name': '8',
                              'desc': 'For Approval'
                           },
                           {
                              'name': '9',
                              'desc': 'Rejected'
                           },
                           {
                              'name': '20',
                              'desc': 'Approved'
                           },
                           {
                              'name': '10',
                              'desc': 'Published'
                           },
                           {
                              'name': '80',
                              'desc': 'Invalid'
                           }
                        ]
                     }
                  }
               ]
            },
            'entities': {
               'entity': [
                  {
                     'name': 'DavesMVAttribute',
                     'desc': 'DavesMVAttribute',
                     'root': 'false',
                     'attrs': {
                        'attr': [
                           {
                              'name': 'Value',
                              'desc': 'Value',
                              'type': '1',
                              'qual': 'DavesMVAttribute\/Value',
                              'required': 'false',
                              'unique': 'false',
                              'searchable': 'true',
                              'repr': 'false',
                              'size': '128'
                           }
                        ]
                     }
                  }
               ]
            },
            'acls': {
               'acl': [
                  {
                     'name': 'Private',
                     'desc': 'Only the last modifier of the item can read and edit'
                  },
                  {
                     'name': 'Public',
                     'desc': 'Open for all users to read and edit'
                  }
               ]
            }
         },
         {
            'name': 'AllAttributes',
            'desc': 'AllAttributes',
            'root': 'true',
            'search': 'false',
            'resEnabled': 'true',
            'versionEnabled': 'true',
            'classification': '2',
            'defaultAcl': 'Public',
            'reprItem': 'entityName',
            'attrs': {
               'attr': [
                  {
                     'name': 'MDS_TemplateName',
                     'desc': 'MDS_TemplateName',
                     'type': '1',
                     'qual': 'MDS_TemplateName',
                     'required': 'false',
                     'unique': 'true',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '128'
                  },
                  {
                     'name': 'MDS_TemplateDetails',
                     'desc': 'MDS_TemplateDetails',
                     'type': '1',
                     'qual': 'MDS_TemplateDetails',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '512'
                  },
                  {
                     'name': 'Short',
                     'desc': 'Short',
                     'type': '3',
                     'qual': 'Short',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'ShortDefault',
                     'desc': 'ShortDefault',
                     'type': '3',
                     'qual': 'ShortDefault',
                     'default': '12',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'ShortMinMax',
                     'desc': 'ShortMinMax',
                     'type': '3',
                     'qual': 'ShortMinMax',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'max': '5',
                     'min': '0'
                  },
                  {
                     'name': 'String',
                     'desc': 'String (name)',
                     'type': '1',
                     'qual': 'String',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'StringDefault',
                     'desc': 'StringDefault',
                     'type': '1',
                     'qual': 'StringDefault',
                     'default': 'Hej',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'StringMax',
                     'desc': 'StringMax',
                     'type': '1',
                     'qual': 'StringMax',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '5'
                  },
                  {
                     'name': 'StringRequired',
                     'desc': 'StringRequired',
                     'type': '1',
                     'qual': 'StringRequired',
                     'default': 'defaultValue',
                     'required': 'true',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'StringUnique',
                     'desc': 'StringUnique',
                     'type': '1',
                     'qual': 'StringUnique',
                     'required': 'false',
                     'unique': 'true',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '64'
                  },
                  {
                     'name': 'ShortRequiredDefault',
                     'desc': 'ShortRequiredDefault',
                     'type': '3',
                     'qual': 'ShortRequiredDefault',
                     'default': '12',
                     'required': 'true',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'ShortUnique',
                     'desc': 'ShortUnique',
                     'type': '3',
                     'qual': 'ShortUnique',
                     'required': 'false',
                     'unique': 'true',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '64'
                  },
                  {
                     'name': 'bool',
                     'desc': 'bool',
                     'type': '20',
                     'qual': 'bool',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'date',
                     'desc': 'date',
                     'type': '7',
                     'qual': 'date',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'timestamp',
                     'desc': 'timestamp',
                     'type': '9',
                     'qual': 'timestamp',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'time',
                     'desc': 'time',
                     'type': '8',
                     'qual': 'time',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'New_attribute',
                     'desc': 'New attribute',
                     'type': '1',
                     'qual': 'New_attribute',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false'
                  },
                  {
                     'name': 'ValuesetShort',
                     'desc': 'ValuesetShort',
                     'type': '3',
                     'qual': 'ValuesetShort',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'vsEntity': 'AllAttributesValuesetShort',
                     'vsAttr': 'value',
                     'valueset': {
                        'value': [
                           {
                              'name': '1',
                              'desc': 'one'
                           },
                           {
                              'name': '2',
                              'desc': 'two'
                           }
                        ]
                     }
                  },
                  {
                     'name': 'ValuesetString',
                     'desc': 'ValuesetString',
                     'type': '1',
                     'qual': 'ValuesetString',
                     'required': 'false',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '64',
                     'vsEntity': 'AllAttributesValuesetString',
                     'vsAttr': 'value',
                     'valueset': {
                        'value': [
                           {
                              'name': 'one',
                              'desc': 'ett'
                           },
                           {
                              'name': 'two',
                              'desc': 'två'
                           }
                        ]
                     }
                  },
                  {
                     'name': 'ValuesetStringRequired',
                     'desc': 'ValuesetStringRequired',
                     'type': '1',
                     'qual': 'ValuesetStringRequired',
                     'default': 'one',
                     'required': 'true',
                     'unique': 'false',
                     'searchable': 'false',
                     'repr': 'false',
                     'size': '64',
                     'vsEntity': 'AllAttributesValuesetString',
                     'vsAttr': 'value',
                     'valueset': {
                        'value': [
                           {
                              'name': 'one',
                              'desc': 'ett'
                           },
                           {
                              'name': 'two',
                              'desc': 'två'
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   }
};
