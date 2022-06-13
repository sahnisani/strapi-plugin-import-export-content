const PERMISSIONS = require("../../constants/permissions");
const { cleanFields } = require("./exportUtils");

async function getData(uid, options, userAbility) {
  const permissionsManager =
    strapi.admin.services.permission.createPermissionsManager({
      ability: userAbility,
      model: uid,
    });

  // Filter content by permissions
  const queryLocale = permissionsManager.queryFrom({'_limit': 1}, PERMISSIONS.read);

  const checkItem = await strapi.entityService.find(
    { params: queryLocale },
    { model: uid }
  );


  let query;
  if (checkItem.hasOwnProperty('_locale')) {
    // Filter content by permissions
    query = permissionsManager.queryFrom({'_limit': 9999999, '_locale': 'all'}, PERMISSIONS.read);
  } else {
    query = permissionsManager.queryFrom({'_limit': 9999999}, PERMISSIONS.read);
  }

  const items = await strapi.entityService.find(
    { params: query },
    { model: uid }
  );

  return Array.isArray(items)
    ? items.map((item) => cleanFields(item, options))
    : [cleanFields(items, options)];
}

module.exports = {
  getData,
};
