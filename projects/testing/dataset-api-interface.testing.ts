import { DatasetApiInterface, SplittedDataDatasetApiInterface } from '@helgoland/core';

export const DatasetApiInterfaceTesting = {
    provide: DatasetApiInterface,
    useClass: SplittedDataDatasetApiInterface
};
