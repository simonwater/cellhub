import { ThemeProvider, supersetTheme } from "@superset-ui/core";
import { Basic, MaximumAggregation } from "./pivot-table";
//import ExampleApp from "./ExampleApp";

const App = () => {
  return (
    <ThemeProvider theme={supersetTheme}>
      {/* <ExampleApp></ExampleApp> */}
      <MaximumAggregation></MaximumAggregation>
      <Basic></Basic>
    </ThemeProvider>
  );
};

export default App;
