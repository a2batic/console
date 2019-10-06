import * as React from 'react';
import { PrometheusResponse } from '@console/internal/components/graphs';
import './usage-breakdown-body.scss';
import {
  ResultTotal,
  ResultAvailable,
  StackGraph,
  StackLegends,
} from '@console/ceph-storage-plugin/src/components/dashboard-page/storage-dashboard/capacity-breakdown/capacity-breakdown-items';
import { Grid, GridItem } from '@patternfly/react-core';

export const CapacityBreakdown: React.FC<CapacityBreakdownProps> = ({
  queriesLoaded,
  capacityQuery,
  selectedQuery,
  chartLegendList,
  legendsLoaded,
}) => {
  if (queriesLoaded) {
    return <div className="pf-c-empty-state">Not available</div>;
  }
  return (
    <Grid>
      <GridItem span={4}>
        <TotalCapacityBody capacityQuery={capacityQuery} />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        <AvailableCapacityBody capacityQuery={capacityQuery} />
      </GridItem>
      <GridItem span={12}>
        <CapacityStackBody selectedQuery={selectedQuery} />
      </GridItem>
      {chartLegendList.map((legends: any) => {
        return (
          <GridItem span={2}>
            <CapacityLegendsBody loaded={legendsLoaded} legends={legends} />
          </GridItem>
        );
      })}
    </Grid>
  );
};

export const TotalCapacityBody: React.FC<TotalCapacityBodyProps> = ({ capacityQuery = [] }) => {
  const objectsLoaded = capacityQuery.length > 0;
  let body: React.ReactNode;
  if (!objectsLoaded) {
    body = <div className="skeleton-activity" />;
  } else {
    body = <ResultTotal results={capacityQuery} />;
  }
  return (
    <>
      <div className="co-usage-breakdown-card__body">{body}</div>
    </>
  );
};

export const AvailableCapacityBody: React.FC<AvailableCapacityBodyProps> = ({
  capacityQuery = [],
}) => {
  const objectsLoaded = capacityQuery.length > 0;
  let body: React.ReactNode;
  if (!objectsLoaded) {
    body = <div className="skeleton-activity" />;
  } else {
    body = <ResultAvailable results={capacityQuery} />;
  }
  return (
    <>
      <div className="co-usage-breakdown-card__body co-usage-breakdown-card__available-body">
        {body}
      </div>
    </>
  );
};

export const CapacityStackBody: React.FC<CapacityStackBodyProps> = ({ selectedQuery = [] }) => {
  const objectsLoaded = selectedQuery.length > 0;
  let body: React.ReactNode;
  if (!objectsLoaded) {
    body = <div className="skeleton-activity co-usage-breakdown-card__stack-loading" />;
  } else {
    body = <StackGraph results={selectedQuery} />;
  }
  return (
    <>
      <div className="co-usage-breakdown-card__body">{body}</div>
    </>
  );
};

export const CapacityLegendsBody: React.FC<CapacityLegendsBodyProps> = ({ legends, loaded }) => {
  const objectsLoaded = legends || loaded;
  let body: React.ReactNode;
  if (!objectsLoaded) {
    body = <div className="skeleton-activity co-usage-breakdown-card__legend-loading" />;
  } else {
    body = <StackLegends results={legends} />;
  }
  return (
    <>
      <div className="co-usage-breakdown-card__body">{body}</div>
    </>
  );
};

type CapacityBreakdownProps = {
  queriesLoaded: boolean;
  capacityQuery: PrometheusResponse[];
  selectedQuery: PrometheusResponse[];
  chartLegendList: any;
  legendsLoaded: boolean;
};

type TotalCapacityBodyProps = {
  capacityQuery: PrometheusResponse[];
};

type AvailableCapacityBodyProps = {
  capacityQuery: PrometheusResponse[];
};

type CapacityStackBodyProps = {
  selectedQuery: PrometheusResponse[];
};

type CapacityLegendsBodyProps = {
  legends: JSX.Element;
  loaded: boolean;
};
