import * as React from 'react';
import { MonitoringRoutes, connectToURLs } from '@console/internal/reducers/monitoring';
import { ExternalLink } from '@console/internal/components/utils';
import { getPrometheusExpressionBrowserURL } from '@console/internal/components/graphs/prometheus-graph';

const HeaderPrometheusLink_ = ({ link, urls }) => (
  <div className="ceph-capacity-breakdown-card__monitoring-header-link">
    <ExternalLink
      href={getPrometheusExpressionBrowserURL(urls, link)}
      text="View more"
    />
  </div>
);

export const HeaderPrometheusLink = connectToURLs(MonitoringRoutes.Prometheus)(
  HeaderPrometheusLink_,
);
