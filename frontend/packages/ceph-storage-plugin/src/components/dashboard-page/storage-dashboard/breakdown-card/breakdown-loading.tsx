import * as React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import './breakdown-card.scss';

export const BreakdownChartLoading: React.FC<{}> = () => {
  return (
    <>
      <Grid className="skeleton-stack-available-bar-box">
        <GridItem lg={4} md={4} sm={4} className="skeleton-stack-available-bar" />
        <GridItem lg={4} md={4} sm={4} />
        <GridItem lg={4} md={4} sm={4} className="skeleton-stack-available-bar" />
      </Grid>
      <Grid className="skeleton-stack-bar-box">
        <GridItem lg={12} md={12} sm={12} className="skeleton-stack-bar" />
      </Grid>
      <Grid gutter="sm" sm={4} className="skeleton-stack-available-bar-box">
        <GridItem lg={2} md={4} sm={4} className="skeleton-stack-legend" />
        <GridItem lg={2} md={4} sm={4} className="skeleton-stack-legend" />
        <GridItem lg={2} md={4} sm={4} className="skeleton-stack-legend" />
        <GridItem lg={2} md={4} sm={4} className="skeleton-stack-legend" />
        <GridItem lg={2} md={4} sm={4} className="skeleton-stack-legend" />
        <GridItem lg={2} md={4} sm={4} className="skeleton-stack-legend" />
      </Grid>
      <Grid />
    </>
  );
};
