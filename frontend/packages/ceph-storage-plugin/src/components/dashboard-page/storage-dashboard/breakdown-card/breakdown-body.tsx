import * as React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { BreakdownChartLoading } from './breakdown-loading';
import { BreakdownChart } from './breakdown-chart';

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  top5UsedStats,
  totalUsed,
  cephUsed,
  cephTotal,
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
      <GridItem span={12}>
        <BreakdownChart />
      </GridItem>
    </Grid>
  );
};

type BreakdownBodyProps = {
  isLoading: boolean;
  totalUsed: PrometheusResponse;
  top5UsedStats: PrometheusResponse;
  cephUsed: PrometheusResponse;
  cephTotal: PrometheusResponse;
};
