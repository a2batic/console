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
import { ProjectModel, StorageClassModel, PodModel } from '@console/internal/models';
import { breakdownQueryMap } from '../../../../constants/queries';
import { PROJECTS } from '../../../../constants/index';
import { BreakdownCardBody } from '../breakdown-card/breakdown-body';
import { HeaderPrometheusLink } from '../breakdown-card/breakdown-header';
import './capacity-breakdown-card.scss';

const keys = Object.keys(breakdownQueryMap);
const dropdownOptions = _.zipObject(keys, keys);

const BreakdownCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const [metricType, setMetricType] = React.useState(PROJECTS);
  const { queries } = breakdownQueryMap[metricType];
  const queryKeys = Object.keys(queries);

  React.useEffect(() => {
    queryKeys.forEach((q) => watchPrometheus(queries[q]));
    return () => queryKeys.forEach((key) => stopWatchPrometheusQuery(queries[key]));
  }, [watchPrometheus, stopWatchPrometheusQuery, metricType, queryKeys, queries]);

  const results = queryKeys.map((key) => prometheusResults.getIn([queries[key], 'data']));
  const queriesLoadError = queryKeys.some((q) =>
    prometheusResults.getIn([queries[q], 'loadError']),
  );
  const queriesDataLoaded = results.some((q) => q);
  const queriesLoaded = queriesDataLoaded || queriesLoadError; // test on debugger
  const [totalUsed, top5UsedStats, cephTotal, cephUsed] = results.map((r) =>
    _.get(r, 'data.result[0].value[1]'),
  );

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
          isLoading={!queriesLoaded}
          totalUsed={totalUsed}
          top5UsedStats={top5UsedStats}
          cephTotal={cephTotal}
          cephUsed={cephUsed}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(BreakdownCard);
