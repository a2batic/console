import * as React from 'react';
import { ChartThemeColor, ChartStack, ChartBar } from '@patternfly/react-charts';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { getCardUsedValue, getCardAvailableValue, getGraphVectorStats } from './utils';
import './capacity-breakdown-card.scss';

export const ResultTotal: React.FC<ResultTotalProps> = ({ results }) => {
  const { total, used } = results ? getCardUsedValue(results) : null;
  if (results)
    return (
      <p className="ceph-capacity-breakdown-card__body">
        {used.string} used of {total.string}
      </p>
    );
  return <></>;
};

export const ResultAvailable: React.FC<ResultAvailableProps> = ({ results }) => {
  const { available } = getCardAvailableValue(results);

  return <p className="ceph-capacity-breakdown-card__body"> {available.string} available</p>;
};

export const StackGraph: React.FC<StackGraphProps> = ({ results }) => {
  const chartData = getGraphVectorStats(results);

  const chartBarList = chartData.map((data, i) => (
    <ChartBar key={i} data={data as []} barRatio={2} barWidth={45} /> // eslint-disable-line react/no-array-index-key
  ));

  return (
    <div className="ceph-capacity-breakdown-card__body ceph-capacity-breakdown-card__stack-chart">
      <ChartStack horizontal height={50} width={600} padding={0} themeColor={ChartThemeColor.multi}>
        {chartBarList}
      </ChartStack>
    </div>
  );
};

export const StackLegends: React.FC<StackLegendsProps> = ({ results }) => {
  return (
    <>
      <div className="ceph-capacity-breakdown-card__body">
        <div className="ceph-capacity-breakdown-card__chart-legend">{results}</div>
      </div>
    </>
  );
};

type ResultTotalProps = {
  results: PrometheusResponse[];
};

type ResultAvailableProps = {
  results: PrometheusResponse[];
};

type StackGraphProps = {
  results: PrometheusResponse[];
};

type StackLegendsProps = {
  results: JSX.Element;
};
