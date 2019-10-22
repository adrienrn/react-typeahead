# react-typeahead

## Get started

```
docker-compose up -d
```

Running the container will start the app with webpack-dev-server and forward port 80 to container port 3000.

## Standalone

The typeahead component could be used standalone, outside of this demo app.

```
<Typeahead
  dataSource={createLocalDataSource({
    data: ['Banana', 'Orange', 'Mandarin', 'Lemon', 'Kiwi'],
  })}
  id='demo-app__s'
  placeholder="Try to search for Mondorin"
/>
```

Usage within a form is working via passing two important props: `name` and `setFieldValue`.

- `name`: the name of the input (in an HTML sense)
- `setFieldValue` is a function that is called by the typeahead whenever its value changes and let the parent form know. This way it should work with a form container managing state or using Formik.

## Data source

Typeahead by itself is a pretty simple component and wouldn't know how to search or suggest matches without a data source. In this demo app, only a `LocalDataSource` is implemented.

A data source is an object that provide a method such as: `query(value: String, limit: Number): Promise`. This promise must resolve to an array of object compliant with the following structure:

```
[
  {
    item: {id: 'some-unique-string', label: 'Label displayed'},
    matches: [
      {
        indices: [[0, 4]],
        key: 'label',
        value: 'Label displayed',
      }
    ]
  }
]
```

The Typeahead component is expecting that structure to operate and implementing your own data source (for a remote API endpoint for example) should follow it.

This separation of concerns lets the component focus on the UI and let the data management to an external source.

_Note: it might be too coupled to the uderlying dependency right now. However, I find this structure to be great and allow to match multiple fields for complex objects, with each different indices to highlight/display._

### Fuzzy search

This demo app is using [fuse.js](https://fusejs.io/) to provide the fuzzy-search. The library had the closest API and data structure to what I had in mind. Also being able to tweak the threshold/distance of the fuzzy match could prove useful.

Other libraries that have been consired :

- [bevacqua/fuzzysearch](https://github.com/bevacqua/fuzzysearch)
- [farzher/fuzzysort](https://github.com/farzher/fuzzysort)

Either way, this kind of things would probably be provided by an API (using ElasticSearch or similar).

### Handling duplicates locally

The LocalDataSource is expecting a simple array of strings.

To handle duplicates and makes it more consistent with other data sources, it maps the data and generate a unique slug (as an id). Another strategy would be to remove duplicates.

The `id` field is used thoughout the application as key prop too.

## Next steps

- Reorganize the repository to have the Typeahead component at the top-level (in a `src/` directory) and move the demo app in an `examples/` directory;
- Make the Typeahead customizable, especially the icon and the formatting of each match entry (in the list). For that I would probably implement it by splitting the component is smaller components and use the children props and for match entries, use render props;
- Enable the scroll when using the keyboard with up and down;
- Enable some options for the LocalDataSource;
