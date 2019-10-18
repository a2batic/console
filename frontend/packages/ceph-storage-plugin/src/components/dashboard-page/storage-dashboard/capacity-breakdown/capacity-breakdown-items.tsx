import * as React from 'react';
import { ChartThemeColor, ChartStack, ChartBar } from '@patternfly/react-charts';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { getCardUsedValue, getGraphVectorStats } from './utils';
import './capacity-breakdown-card.scss';


export const StackLegends: React.FC<StackLegendsProps> = ({ results }) => {
  return (
    <>
      <div className="ceph-capacity-breakdown-card__body">
        <div className="ceph-capacity-breakdown-card__chart-legend">{results}</div>
      </div>
    </>
  );
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
