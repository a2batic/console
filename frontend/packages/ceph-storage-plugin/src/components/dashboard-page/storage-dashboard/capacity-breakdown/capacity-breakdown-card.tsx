import * as React from 'react';
import * as _ from 'lodash';
import { ChartLegend } from '@patternfly/react-charts';
import { CapacityBreakdown } from '@console/shared/src/components/dashboard/usage-breakdown-card/usage-breakdown-body';
import { Dropdown } from '@console/internal/components/utils';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { CAPACITY_BREAKDOWN_QUERIES } from '../../../../constants/queries';
import { PROJECTS, STORAGE_CLASSES } from '../../../../constants/index';
import { getGraphLegendsStats, getGraphVectorStats, HeaderPrometheusLink } from './utils';

import './capacity-breakdown-card.scss';

const capacityResourceValue = {
  [PROJECTS]: ['PROJECTS_BY_USED_TOP_5', 'PROJECTS_BY_USED'],
  [STORAGE_CLASSES]: ['STORAGE_CLASSES_BY_USED_TOP_5', 'STORAGE_CLASSES_BY_USED'],
};

const metricTypes = _.keys(capacityResourceValue);
const metricTypesOptions = _.zipObject(metricTypes, metricTypes);

const BreakdownCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const [metricType, setMetricType] = React.useState(metricTypes[0]);
  React.useEffect(() => {
    Object.keys(CAPACITY_BREAKDOWN_QUERIES).forEach((key) =>
      watchPrometheus(CAPACITY_BREAKDOWN_QUERIES[key]),
    );
    return () =>
      Object.keys(CAPACITY_BREAKDOWN_QUERIES).forEach((key) =>
        stopWatchPrometheusQuery(CAPACITY_BREAKDOWN_QUERIES[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const results: PrometheusResponse[] = Object.keys(CAPACITY_BREAKDOWN_QUERIES).map(
    (q) => prometheusResults.getIn([CAPACITY_BREAKDOWN_QUERIES[q], 'data']) as PrometheusResponse,
  );

  const queriesLoaded = Object.keys(CAPACITY_BREAKDOWN_QUERIES).every((q) =>
    prometheusResults.getIn([CAPACITY_BREAKDOWN_QUERIES[q], 'loadError']),
  );

  const projectQuery = [results[0], results[1]];
  const storageClassQuery = [results[2], results[3]];
  const capacityQuery = [results[4], results[5]];
  const selectedQuery = metricType === 'Projects' ? projectQuery : storageClassQuery;

  const chartLegendsData = getGraphVectorStats(selectedQuery);
  const legendData = getGraphLegendsStats(chartLegendsData);
  const chartLegendList = legendData.map((data: any) => (
    <ChartLegend
      data={data as []}
      style={{
        labels: { fontSize: 50 },
      }}
      orientation="horizontal"
      padding={0}
      y={100}
    /> // eslint-disable-line react/no-array-index-key
  ));

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Breakdown</DashboardCardTitle>
        <div className="ceph-capacity-breakdown-card__header">
          <HeaderPrometheusLink />
          <Dropdown
            items={metricTypesOptions}
            onChange={setMetricType}
            selectedKey={metricType}
            title={metricType}
          />
        </div>
      </DashboardCardHeader>
      <DashboardCardBody classname="ceph-capacity-breakdown-card__body">
        <CapacityBreakdown
          queriesLoaded={queriesLoaded}
          capacityQuery={capacityQuery}
          selectedQuery={selectedQuery}
          chartLegendList={
            chartLegendList.length > 0 ? chartLegendList : [null, null, null, null, null, null]
          }
          legendsLoaded={chartLegendList.length > 0}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(BreakdownCard);
