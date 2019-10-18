import * as React from 'react';
import { PrometheusResponse } from '@console/internal/components/graphs';
import './usage-breakdown-body.scss';
import {
  StackGraph,
} from '@console/ceph-storage-plugin/src/components/dashboard-page/storage-dashboard/capacity-breakdown/capacity-breakdown-items';

export const TotalCapacityBody: React.FC<TotalCapacityBodyProps> = ({ value }) => {
  return (
    <p className="ceph-capacity-breakdown-card__body">
      {value}
    </p>
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


type TotalCapacityBodyProps = {
  value: string;
};

type CapacityStackBodyProps = {
  selectedQuery: PrometheusResponse[];
};

