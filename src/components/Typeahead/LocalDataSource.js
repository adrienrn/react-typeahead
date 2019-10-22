import Fuse from 'fuse.js';
import slugify from 'slugify';

export function createLocalDataSource({ data }) {
  return new LocalDataSource(data);
}

/**
 * A data source is what is called to query a data endpoint.
 *
 * This data source is querying a local data array. We could imagine have an
 * another data source querying some API endpoint.
 */
class LocalDataSource {
  constructor(data) {
    // Expected data is an array of strings.
    // To make it friendlier to the calling components, we'll map that to an
    // array of objects with unique ids (that are slugs) to handle duplicates.
    // Another strategy here would be to remove the duplicates.
    const slugifier = new Slugifier();
    const mappedData = data.map(strValue => {
      return {
        id: slugifier.generateSlug(strValue),
        label: strValue,
      };
    });

    this.fuzzyMatcher = new Fuse(mappedData, {
      includeMatches: true,
      keys: ['label'],
      location: 0,
      minMatchCharLength: 1,
      shouldSort: true,
      threshold: 0.42,
    });
  }

  query(value, limit) {
    return new Promise((resolve, reject) => {
      const matches = this.fuzzyMatcher.search(value);

      if (limit) {
        return resolve(matches.slice(0, limit));
      }

      return resolve(matches);
    });
  }
}

/**
 * Small stateful slugifier to generate unique slugs.
 *
 * Multiple calls with the same input, would produce different slugs.
 *
 * Ex: 3x generateSlug("Foo") would produce: "foo", "foo-1", "foo-2".
 */
class Slugifier {
  constructor() {
    this.cache = {};
  }

  generateSlug(strValue) {
    let slug = slugify(strValue, { lower: true });
    if (!this.cache[strValue]) {
      this.cache[strValue] = 1;

      return slug;
    }

    slug = slug + '-' + this.cache[strValue];
    this.cache[strValue] = this.cache[strValue] + 1;

    return slug;
  }
}
