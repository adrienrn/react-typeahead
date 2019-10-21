import Fuse from 'fuse.js';

export function createLocalDataSource({
  data,
})
{

  return new LocalDataSource(data);
}

/**
 * A data source is what is called to query a data endpoint.
 *
 * This data source is querying a local data array. We could imagine have an
 * another data source querying some API endpoint.
 */
class LocalDataSource
{
  constructor(data)
  {
    this.fuzzyMatcher = new Fuse(data, {
      includeMatches: true,
      keys: [
        'label',
      ],
      minMatchCharLength: 1,
      shouldSort: true,
      threshold: 0.42,
    });
  }

  query(value)
  {
    return new Promise((resolve, reject) => {
      const matches = this.fuzzyMatcher.search(value);

      return resolve(matches);
    });
  }
}
