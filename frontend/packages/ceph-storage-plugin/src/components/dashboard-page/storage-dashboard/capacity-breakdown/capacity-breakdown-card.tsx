import * as React from 'react';
import * as _ from 'lodash';
import { Dropdown } from '@console/internal/components/utils';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import { ProjectModel, StorageClassModel } from '@console/internal/models';
import { CAPACITY_BREAKDOWN_QUERIES, StorageDashboardQuery } from '../../../../constants/queries';
import { PROJECTS, STORAGE_CLASSES } from '../../../../constants/index';
import { BreakdownCardBody } from '../breakdown-card/breakdown-body';
import { HeaderPrometheusLink } from '../breakdown-card/breakdown-header';
import './capacity-breakdown-card.scss';

const breakdownQueryMap = {
  [PROJECTS]: {
    model: ProjectModel,
    metric: 'namespace',
    queries: {
      [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_TOTAL_USED],
      [StorageDashboardQuery.PROJECTS_BY_USED_TOP_5]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_BY_USED_TOP_5],
    },
  },
  [STORAGE_CLASSES]: {
    model: StorageClassModel,
    metric: 'storage_class', // this is right or not
    queries: {
      [StorageDashboardQuery.STORAGE_CLASSES_BY_USED_TOP_5]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_TOTAL_USED],
      [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_TOTAL_USED],
    },
  },
  // @TODO: BY PODS
};

const keys = Object.keys(breakdownQueryMap);
const dropdownOptions = _.zipObject(keys, keys);

const BreakdownCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const [metricType, setMetricType] = React.useState(PROJECTS);
  React.useEffect(() => {
    const queries = Object.keys(breakdownQueryMap[metricType].queries);
    queries.forEach((key) => watchPrometheus(CAPACITY_BREAKDOWN_QUERIES[key]));
    return () =>
      queries.forEach((key) => stopWatchPrometheusQuery(CAPACITY_BREAKDOWN_QUERIES[key]));
  }, [watchPrometheus, stopWatchPrometheusQuery, metricType]);

  const queries = Object.keys(breakdownQueryMap[metricType].queries);
  const [totalUsed, top5UsedStats] = queries.map((q) => prometheusResults.getIn([q, 'data']));
  // @TODO: total and avilable queries
  const queriesLoadError = queries.some((q) => prometheusResults.getIn([q, 'loadError']));
  const queriesLoaded = (totalUsed && top5UsedStats) || queriesLoadError;

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle> CapacityBreakdown</DashboardCardTitle>
        <div className="ceph-capacity-breakdown-card__header">
          <HeaderPrometheusLink />
          <Dropdown
            items={dropdownOptions}
            onChange={setMetricType}
            selectedKey={metricType}
            title={metricType}
          />
        </div>
      </DashboardCardHeader>
      <DashboardCardBody>
        <BreakdownCardBody
          isLoading={queriesLoaded}
          totalUsed={totalUsed}
          top5UsedStats={top5UsedStats}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(BreakdownCard);
