import * as React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { BreakdownChartLoading } from './breakdown-loading';
import { getCardUsedValue, getGraphVectorStats } from '../capacity-breakdown/utils';
import { TotalCapacityBody, CapacityStackBody } from '@console/shared/src/components/dashboard/usage-breakdown-card/usage-breakdown-body';
import { ChartBar } from '@patternfly/react-charts';

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

  const { total, used, available } = (cephUsed && cephTotal) ? getCardUsedValue(cephUsed, cephTotal) : null;
  const usedCapacity = `${used.string} ${used.unit} used of ${total.string} ${total.unit}`;
  const availableCapacity = `${available.string} ${available.unit} available`;

  const stackData = top5UsedStats && totalUsed ? getGraphVectorStats(top5UsedStats, totalUsed) : null;

  const chartBarList = stackData.map((data, i) => (
    <ChartBar key={i} data={data as []} barRatio={2} barWidth={45} /> // eslint-disable-line react/no-array-index-key
  ));

  return (
    <Grid>
      <GridItem span={4}><TotalCapacityBody value={usedCapacity} /></GridItem>
      <GridItem span={4} />
      <GridItem span={4}><TotalCapacityBody value={availableCapacity} /></GridItem>
      <GridItem span={12}><CapacityStackBody value={chartBarList} /></GridItem>
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
