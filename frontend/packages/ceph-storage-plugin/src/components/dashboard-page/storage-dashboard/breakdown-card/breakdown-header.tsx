import * as React from 'react';
import { MonitoringRoutes, connectToURLs } from '@console/internal/reducers/monitoring';
import { ExternalLink } from '@console/internal/components/utils';
import { getPrometheusExpressionBrowserURL } from '@console/internal/components/graphs/prometheus-graph';

export const HeaderPrometheusLink = connectToURLs(MonitoringRoutes.Prometheus)(({ urls }) => (
  <div className="ceph-capacity-breakdown-card__monitoring-header-link">
    <ExternalLink
      href={getPrometheusExpressionBrowserURL(urls, [`topk(20, sum(node_filesystem_size_bytes))`])}
      text="View more"
    />
  </div>
));
