import * as React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import './breakdown-card.scss';

export const BreakdownChartLoading: React.FC<{}> = () => {
  return (
    <>
      <Grid className="skeleton-box">
        <GridItem span={4} className="skeleton-activity" />
        <GridItem span={4} className="skeleton-activity skeleton-stack-available-bar" />
        <GridItem span={4} className="skeleton-activity" />
        <GridItem span={12} className="skeleton-activity skeleton-stack-bar" />
        <GridItem span={2} className="skeleton-activity skeleton-stack-legend" />
        <GridItem span={2} className="skeleton-activity skeleton-stack-legend" />
        <GridItem span={2} className="skeleton-activity skeleton-stack-legend" />
        <GridItem span={2} className="skeleton-activity skeleton-stack-legend" />
        <GridItem span={2} className="skeleton-activity skeleton-stack-legend" />
        <GridItem span={2} className="skeleton-activity skeleton-stack-legend" />
      </Grid>
    </>
  );
};
