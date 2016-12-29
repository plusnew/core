export default {
  isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  },

  getReference(obj, keyParts) {
    if (keyParts.length === 0) {
      throw new Error('You have to give me an key, else it won\'t work');
    }

    let result = obj;
    for (let i = 0; i < keyParts.length - 1; i++) {
      result = obj[keyParts[i]];
    }

    return result;
  },
};
