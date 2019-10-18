import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart,
  ChartAxis,
  ChartStack,
  ChartThemeColor,
  ChartLegend,
  ChartBar,
  ChartLabel,
  ChartTooltip,
} from '@patternfly/react-charts';
import { DataPoint } from '@console/internal/components/graphs';
import { K8sKind } from '@console/internal/module/k8s';
import { resourcePathFromModel } from '@console/internal/components/utils';

const LinkableLegend = (props) => {
  const legendData = props.data;
  const { model } = props;

  return legendData.map((d) => {
    return (
      <p>
        <Link to={resourcePathFromModel(model, d.name)}>
          <ChartLabel {...props} />
        </Link>
        <br />
        <span>{d.value}</span>
      </p>
    );
  });
};

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ data, legends, model }) => {
  const chartData = data.map((d: DataPoint, index) => (
    <ChartBar
      cornerRadius={{ bottom: index === 0 || index === data.length - 1 ? 3 : 0 }} // look for it
      barWidth={20}
      padding={10}
      data={[d]}
      labelComponent={<ChartTooltip constrainToVisibleArea />}
    />
  ));
  return (
    <Chart
      legendPosition="bottom-left"
      legendComponent={
        <ChartLegend
          themeColor={ChartThemeColor.purple}
          data={legends}
          labelComponent={<LinkableLegend model={model} />}
          orientation="horizontal"
          symbolSpacer={7}
          height={30}
          gutter={10}
          padding={{ top: 0, bottom: 0 }}
          style={{ labels: { fontSize: 8 } }}
        />
      }
      height={100}
      padding={{
        bottom: 75,
        left: 30,
        right: 30,
        top: 30,
      }}
      themeColor={ChartThemeColor.multiOrdered}
    >
      <ChartAxis
        style={{ axis: { stroke: 'none' }, ticks: { stroke: 'none' } }}
        tickFormat={() => ''}
      />
      <ChartStack horizontal>{chartData}</ChartStack>
    </Chart>
  );
};

type BreakdownChartProps = {
  data: DataPoint[];
  legends: { name: string }[];
  model: K8sKind;
};
