import * as React from 'react';
import * as _ from 'lodash';
import { Grid, GridItem, EmptyState, Title, EmptyStateVariant } from '@patternfly/react-core';
import { DataPoint } from '@console/internal/components/graphs';
import { K8sKind } from '@console/internal/module/k8s';
// import { TotalCapacityBody } from './breakdown-capacity';
import { BreakdownChartLoading } from './breakdown-loading';
import { BreakdownChart } from './breakdown-chart';

const getTotal = (stats: DataPoint[]) => {
  return stats.reduce((total, dataPoint) => total + dataPoint.y, 0);
};

const addOthers = (stats: DataPoint[], totalUsed) => {
  const top5Total = getTotal(stats);
  const others = totalUsed - top5Total;
  const othersData = {
    x: 'Others',
    y: others,
    metric: _.get(stats, '0', 'metric'), // need to check if its safe
  };
  return [...stats, othersData];
};

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  top5UsedStats,
  totalUsed,
  cephUsed,
  cephTotal,
  model,
  isLoading,
}) => {
  if (isLoading) {
    return <BreakdownChartLoading />;
  }
  // if (!cephUsed || !cephTotal || !totalUsed || !top5UsedStats.length) {
  //   return (
  //     <EmptyState variant={EmptyStateVariant.full}>
  //       <Title className="graph-empty-state__title text-secondary" size="sm">
  //         Not available.
  //       </Title>
  //     </EmptyState>
  //   );
  // }
  const chartData =
    top5UsedStats.length === 5 ? addOthers(top5UsedStats, totalUsed) : top5UsedStats;
  const legends: LegendType = chartData.map((d) => ({
    name: d.x,
    value: d.y,
    namespace: d.metric.namespace,
  })) as LegendType;

  // const usedCapacity = `${used.string} ${used.unit} used of ${total.string} ${total.unit}`;
  // const availableCapacity = `${available.string} ${available.unit} available`;
  return (
    <Grid>
      <GridItem span={4}>{/* <TotalCapacityBody value={usedCapacity} /> */}</GridItem>
      <GridItem span={4} />
      <GridItem span={4}>{/* <TotalCapacityBody value={availableCapacity} /> */}</GridItem>
      <GridItem span={12}>
        <BreakdownChart data={chartData} legends={legends} model={model} />
      </GridItem>
    </Grid>
  );
};

type BreakdownBodyProps = {
  isLoading: boolean;
  totalUsed: string;
  top5UsedStats: DataPoint[];
  cephUsed: string;
  cephTotal: string;
  model: K8sKind;
};

type LegendType = {
  name: string;
  value: number;
  namespace: string;
}[];
