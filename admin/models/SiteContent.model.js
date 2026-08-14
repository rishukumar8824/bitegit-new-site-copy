const SiteContentSchema = {
  key: 'string (unique)',
  value: 'mixed',
  updatedBy: 'string',
  updatedAt: 'date'
};

module.exports = {
  modelName: 'SiteContent',
  collectionName: 'site_content',
  SiteContentSchema
};
