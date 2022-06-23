const importToCollectionType = async (uid, item) => {
  try {

    let params = { name: item.name, _limit: 9999999 };
    if (item.hasOwnProperty('locale')) {
      params._locale = 'all';
    }
    const existingItemsWithSameName = await strapi.entityService.find({ params: params}, { model: uid });

    let existingItemToUpdate;

    item.localizations = []
    if (Array.isArray(existingItemsWithSameName) && existingItemsWithSameName.length != 0) {
      for await (const existingItem of existingItemsWithSameName) {
        if (existingItem.locale == item.locale) {
          existingItemToUpdate = existingItem;
        } else {
          item.localizations.push(existingItem.id);
        }
      }
    }

    if (existingItemToUpdate) {
      await strapi.entityService.update({ data: item , params: { id: existingItemToUpdate.id } }, { model: uid });
    } else {
      await strapi.entityService.create({ data: item }, { model: uid });
    }

    // await strapi.query(uid).create(item);
    return true;
  } catch (error) {
    return false;
  }
};

const importToSingleType = async (uid, item) => {
  try {
    const existing = await strapi.query(uid).find({});
    if (existing.length > 0) {
      const { id } = existing[0];
      delete item.created_by;
      await strapi.query(uid).update({ id }, item);
    } else {
      strapi.query(uid).create(item);
    }
    return [true];
  } catch (error) {
    return [false];
  }
};

module.exports = {
  importToCollectionType,
  importToSingleType,
};
