import { Injectable } from '@angular/core';

import { ReferenceValue } from '../../model/dataset-api/dataset';
import { ReferenceValueGroup } from '../../model/settings/settings';

export interface DetectedReferenceValueGroup {
  group: ReferenceValueGroup;
  members: ReferenceValue[];
}

export interface GroupedReferenceValues {
  groups: DetectedReferenceValueGroup[];
  ungrouped: ReferenceValue[];
}

@Injectable()
export class ReferenceValueGroupingService {
  constructor() {}

  /**
   * Detects groups of reference values based on configured groups.
   *
   * Only creates a group if ALL member IDs are present in the reference values.
   * Uses case-insensitive matching for member IDs.
   *
   * @param referenceValues - Array of reference values from a dataset
   * @param configuredGroups - Array of configured reference value groups from settings
   * @returns Object containing detected groups and ungrouped reference values
   */
  detectGroups(
    referenceValues: ReferenceValue[],
    configuredGroups: ReferenceValueGroup[],
  ): GroupedReferenceValues {
    if (!referenceValues || referenceValues.length === 0) {
      return { groups: [], ungrouped: [] };
    }

    if (!configuredGroups || configuredGroups.length === 0) {
      return { groups: [], ungrouped: referenceValues };
    }

    const groups: DetectedReferenceValueGroup[] = [];
    const groupedRefValIds = new Set<string>();

    // Try to match each configured group
    for (const configuredGroup of configuredGroups) {
      const members: ReferenceValue[] = [];

      // For each member ID in the group configuration
      for (const memberId of configuredGroup.memberIds) {
        // Find matching reference value (case-insensitive)
        const matchingRefVal = referenceValues.find((refVal) =>
          refVal.label.toLowerCase() === memberId.toLowerCase(),
        );

        if (matchingRefVal) {
          members.push(matchingRefVal);
        }
      }

      // Only create group if ALL members were found
      if (members.length === configuredGroup.memberIds.length) {
        groups.push({
          group: configuredGroup,
          members: members,
        });

        // Mark these reference values as grouped
        for (const member of members) {
          groupedRefValIds.add(member.referenceValueId);
        }
      }
    }

    // Collect ungrouped reference values
    const ungrouped = referenceValues.filter(
      (refVal) => !groupedRefValIds.has(refVal.referenceValueId),
    );

    return { groups, ungrouped };
  }

  /**
   * Checks if a reference value group is currently visible.
   *
   * A group is considered visible if ALL its member IDs are in the showReferenceValues array.
   *
   * @param group - The detected reference value group
   * @param showReferenceValues - Array of visible reference value options
   * @returns True if all members are visible
   */
  isGroupVisible(
    group: DetectedReferenceValueGroup,
    showReferenceValues: { id: string }[],
  ): boolean {
    const visibleIds = new Set(showReferenceValues.map((rv) => rv.id));
    return group.members.every((member) =>
      visibleIds.has(member.referenceValueId),
    );
  }
}
