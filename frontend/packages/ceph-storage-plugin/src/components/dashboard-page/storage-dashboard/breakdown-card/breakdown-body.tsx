import * as React from 'react';
import { Grid, GridItem, EmptyState, Title, EmptyStateVariant } from '@patternfly/react-core';
import { humanizeBinaryBytesWithoutB, Humanize } from '@console/internal/components/utils';
import { DataPoint } from '@console/internal/components/graphs';
import { K8sKind } from '@console/internal/module/k8s';
import { TotalCapacityBody } from './breakdown-capacity';
import { BreakdownChartLoading } from './breakdown-loading';
import { BreakdownChart } from './breakdown-chart';
import { getCapacityValue } from './utils';

const getTotal = (stats: DataPoint[]) => {
  return stats.reduce((total, dataPoint) => total + dataPoint.y, 0);
};

const addOthers = (stats: DataPoint[], totalUsed) => {
  const top5Total = getTotal(stats);
  const others = totalUsed - top5Total;
  const othersData = {
    x: '',
    y: others,
    label: humanizeBinaryBytesWithoutB(others).string, // need to check if its safe
  };
  return [...stats, othersData];
};

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  top5UsedStats,
  totalUsed,
  cephUsed,
  cephTotal,
  model,
  formatValue,
  isLoading,
}) => {
  if (isLoading) {
    return <BreakdownChartLoading />;
  }
  if (!cephUsed || !cephTotal || !totalUsed || !top5UsedStats.length) {
    return (
      <EmptyState variant={EmptyStateVariant.full}>
        <Title className="graph-empty-state__title text-secondary" size="sm">
          Not available.
        </Title>
      </EmptyState>
    );
  }
  const chartData =
    top5UsedStats.length === 5 ? addOthers(top5UsedStats, totalUsed) : top5UsedStats;
  const legends: LegendType = chartData.map((d: DataPoint) => ({
    name: d.label,
    value: d.y,
  })) as LegendType;

  const available = getCapacityValue(cephUsed, cephTotal, formatValue);
  const usedCapacity = `${formatValue(cephUsed).string} used of ${formatValue(cephTotal).string}`;
  const availableCapacity = `${available.string} available`;
  return (
    <Grid>
      <GridItem span={4}>
        <TotalCapacityBody value={usedCapacity} />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        <TotalCapacityBody value={availableCapacity} />
      </GridItem>
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
  formatValue: Humanize;
};

type LegendType = {
  name: string;
  value: number;
  namespace?: string;
}[];
