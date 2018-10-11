# Handle styling options for datasets

## Structure of the dataset options

[Here](../../classes/DatasetOptions.html) you can see the current structure of the DatasetOption with all it's properties.

## Use a dataset service to manage a set of datasets

You can handle a set of datasets and their corresponding dataset options with the abstract class [DatasetService](../../classes/DatasetService.html). And implementation of this DatasetService provides the following properties, which can be included for example in the [D3TimeseriesGraphComponent](../../components/D3TimeseriesGraphComponent.html) to display the set of datasets:

- `datasetids` - An array of datasetIds
- `datasetOptions` - A mapped object of the datasetId and a dataset options object

You can implement this abstract class [DatasetService](../../classes/DatasetService.html) with the following methods:

- `createStyles` - This is the default creation of a DatasetOptions, when you add a Dataset without a predefined DatasetOption
- `saveState` - Implementation of a mechansim to save this set of DatasetOptions (e.g. in the local storage or to an server)
- `loadState` - The corresponding loading machanism to the save method.
