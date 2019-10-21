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
    this.data = data;
  }

  query(value)
  {
    return new Promise((resolve, reject) => {
      const matches = this.data.map((label) => {
        // Crappy slug transform for now.
        const slug = label.toLowerCase().replace(' ', '--');

        return {
          match: label.slice(0, 3),
          score: Math.random(0, 1),
          item: {
            label: label,
            value: slug,
          }
        };
      }).sort((a, b) => {
        return a.score >= b.score ? 1 : -1;
      }).slice(0, 5);

      return resolve(matches);
    });
  }
}
