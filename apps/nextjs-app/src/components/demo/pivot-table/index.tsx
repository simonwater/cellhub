import { SuperChart, VizType } from "@superset-ui/core";
import { PivotTableChartPlugin } from "@superset-ui/plugin-chart-pivot-table";
import { basicFormData, basicData } from "./testData";

new PivotTableChartPlugin().configure({ key: VizType.PivotTable }).register();

export const Basic = ({ width, height }: { width: number; height: number }) => (
  <SuperChart
    chartType={VizType.PivotTable}
    datasource={{
      columnFormats: {},
    }}
    width={width}
    height={height}
    queriesData={[basicData]}
    formData={basicFormData}
  />
);
Basic.parameters = {
  initialSize: {
    width: 680,
    height: 420,
  },
};

export const MaximumAggregation = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <SuperChart
    chartType={VizType.PivotTable}
    datasource={{
      columnFormats: {},
    }}
    width={width}
    height={height}
    queriesData={[basicData]}
    formData={{ ...basicFormData, aggregateFunction: "Maximum" }}
  />
);
MaximumAggregation.parameters = {
  initialSize: {
    width: 680,
    height: 420,
  },
};
