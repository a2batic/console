import * as React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { BreakdownChartLoading } from './breakdown-loading';

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  total5TopUsed,
  totalUsed,
  isLoading,
}) => {
  if (isLoading) {
    return <BreakdownChartLoading />;
  }
  return (
    <Grid>
      <GridItem span={4}>{/* <TotalCapacityBody capacityQuery={capacityQuery} /> */}</GridItem>
      <GridItem span={4} />
      <GridItem span={4}>{/* <AvailableCapacityBody capacityQuery={capacityQuery} /> */}</GridItem>
      <GridItem span={12}>{/* <CapacityStackBody selectedQuery={selectedQuery} /> */}</GridItem>
    </Grid>
  );
};

type BreakdownBodyProps = {
  isLoading: boolean;
  totalUsed: PrometheusResponse;
  total5TopUsed: PrometheusResponse;
};
