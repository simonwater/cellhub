import {
  ThemeProvider,
  supersetTheme,
  themeObject,
  exampleThemes,
  configure,
} from "@superset-ui/core";
configure();

import { createStore } from "redux";
import { Provider } from "react-redux";
import { App as AtApp, Layout } from "antd";
import dynamic from "next/dynamic";

//import ExampleApp from "./ExampleApp";
import { Basic, MaximumAggregation } from "./PivotTable";
import { AreaSeries } from "./AreaSeries";
import { BoxPlot } from "./BoxPlot";
import { BubbleChart } from "./Bubble";
import { Funnel } from "./Funnel";
import { Gauge } from "./Gauge";
import { Graph } from "./Graph";
import {
  Timeseries as MixedTimeseries,
  WithNegativeNumbers as MixedWithNegativeNumbers,
} from "./MixedSeries";
import { WeekdayPie, PopulationPie, SalesPie } from "./Pie";
import { Radar } from "./Radar";
import { Sunburst } from "./Sunburst";
import {
  Timeseries,
  WithNegativeNumbers,
  ConfidenceBand,
  StackWithNulls,
} from "./Timeseries";
import { Tree } from "./Tree";
import { Treemap } from "./Treemap";
import { Waterfall } from "./Waterfall";

const store = createStore(() => {});
const App = () => {
  themeObject.setConfig(exampleThemes["superset"]);
  return (
    <themeObject.SupersetThemeProvider>
      <AtApp>
        <Layout
          style={{
            minHeight: "100vh",
            width: "100%",
            padding: 24,
            backgroundColor: themeObject.theme.colorBgBase,
          }}
        >
          <Provider store={store}>
            {/* <ExampleApp></ExampleApp> */}
            {/* <MaximumAggregation></MaximumAggregation>
          <Basic></Basic> */}
            <BoxPlot></BoxPlot>
          </Provider>
        </Layout>
      </AtApp>
    </themeObject.SupersetThemeProvider>
  );
};

// const App = () => {
//   return (
//     <ThemeProvider theme={supersetTheme}>
//       <Provider store={store}>
//         {/* <ExampleApp></ExampleApp> */}
//         {/* <MaximumAggregation></MaximumAggregation>
//           <Basic></Basic> */}
//         <AreaSeries></AreaSeries>
//       </Provider>
//     </ThemeProvider>
//   );
// };

export default App;
