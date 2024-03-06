import { ApiV3Dataset, HelgolandTimeseries } from '@helgoland/core';

import { FacetSearchElement } from './facet-search-model';

export function convertToFacetEntry(timeseries: HelgolandTimeseries): FacetSearchElement {
    const facetEntry: FacetSearchElement = {
        id: timeseries.id,
        label: timeseries.label,
        url: timeseries.url,
        firstValue: timeseries.firstValue,
        lastValue: timeseries.lastValue,
        category: timeseries.parameters.category,
        offering: timeseries.parameters.offering,
        phenomenon: timeseries.parameters.phenomenon,
        procedure: timeseries.parameters.procedure
    };
    if (timeseries.parameters.feature && timeseries.platform.geometry) {
        facetEntry.feature = {
            id: timeseries.parameters.feature.id,
            label: timeseries.parameters.feature.label,
            geometry: timeseries.platform.geometry
        }
    }
    return facetEntry
}

export function convertFromApiV3Dataset(ds: ApiV3Dataset, url: string): FacetSearchElement {
    const entry: FacetSearchElement = { url };
    if (ds.id) { entry.id = ds.id }
    if (ds.label) { entry.label = ds.label }
    if (ds.firstValue?.timestamp && ds.firstValue?.value) {
        entry.firstValue = {
            timestamp: new Date(ds.firstValue.timestamp).getTime(),
            value: ds.firstValue.value
        }
    }
    if (ds.lastValue?.timestamp && ds.lastValue?.value) {
        entry.lastValue = {
            timestamp: new Date(ds.lastValue.timestamp).getTime(),
            value: ds.lastValue.value
        }
    }
    if (ds.parameters?.category?.id && ds.parameters?.category?.label) {
        entry.category = {
            id: ds.parameters.category.id,
            label: ds.parameters.category.label
        }
    }
    if (ds.parameters?.offering?.id && ds.parameters?.offering?.label) {
        entry.offering = {
            id: ds.parameters.offering.id,
            label: ds.parameters.offering.label
        }
    }
    if (ds.parameters?.phenomenon?.id && ds.parameters?.phenomenon?.label) {
        entry.phenomenon = {
            id: ds.parameters.phenomenon.id,
            label: ds.parameters.phenomenon.label
        }
    }
    if (ds.parameters?.procedure?.id && ds.parameters?.procedure?.label) {
        entry.procedure = {
            id: ds.parameters.procedure.id,
            label: ds.parameters.procedure.label
        }
    }
    if (ds.feature?.id && ds.feature?.properties?.label && ds.feature.geometry) {
        entry.feature = {
            id: ds.feature.id,
            label: ds.feature.properties.label,
            geometry: ds.feature.geometry
        }
    }
    return entry;
}