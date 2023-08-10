import * as echarts from 'echarts';
import React, {
  type DOMAttributes,
  type FC,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as zrender from 'zrender';

export type ChartApi = echarts.ECharts;
export type ChartTheme = {
  // That's literally how `ThemeOption` type is defined internally in eCharts and it's not exported, so redefining it here.
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  [key: string]: any;
};

type EChartInitParams = Parameters<typeof echarts.init>;
// eCharts docs say `It's only optional when opts.ssr is enabled for server-side rendering.` about the `dom` parameter.
// However, the declared type of this parameter is not optional, so we fix it in our derived type.
type EChartInit = (
  dom?: EChartInitParams[0],
  theme?: EChartInitParams[1],
  opts?: EChartInitParams[2]
) => ReturnType<typeof echarts.init>;
// This type is not exported, so we do a few tricks here to get it.
type EChartInitOptions = Exclude<EChartInitParams[2], undefined>;
export type ChartInitOptions = EChartInitOptions & {
  height?: Exclude<EChartInitOptions['height'], string>;
  width?: Exclude<EChartInitOptions['width'], string>;
};
export interface ChartProps extends echarts.EChartsOption {
  /**
   * The options to use when initializing a chart instance.
   * These are the same as described [here](https://echarts.apache.org/en/api.html#echarts.init).
   *
   * If both `width` and `hight` inside `initOptions` are set (useful for testing),
   * the chart will use the explicitly set size instead of autosizing to its container.
   *
   * Be careful using this config: if a different options object is provided (reference equality),
   * the chart will be reinstantiated.
   */
  initOptions?: ChartInitOptions;
  /**
   * To access chart instance after it's been created (to bind events, get chart's image data, etc.)
   * use the value returned by the `useChartApiRef` hook for this prop.
   */
  ref?: React.MutableRefObject<ChartApi | undefined>;
  /**
   * The rendering backend. Defaults to `canvas`.
   */
  renderer?: 'canvas' | 'svg';
  /**
   * The second parameter to the [echartsInstance.setOption](https://echarts.apache.org/en/api.html#echartsInstance.setOption) call.
   * By default `series`, `xAxis` and `yAxis` components will be merged in the `replaceMerge` mode on updates,
   * therefore it's good practice to specify `id`s for those components, if you don't intend for them to be replaced on updates.
   */
  setOptions?: echarts.SetOptionOpts;
  /**
   * The name of a registered chart theme object. If not specified, this will match the `themeKey` from the nearest `DesignProvider`.
   * Use `ChartThemeUpdater` at the root of your component tree to update and register chart themes when design context changes.
   */
  theme?: string | object;
}

export const useChartApiRef = () => useRef<ChartApi>();

/**
 * Thin React wrapper for the ECharts charting library.
 *
 * This component can be used either directly or by creating a component that wraps this component.
 * In the latter case, we strive to preserve the original eCharts API as much as possible, so that the props
 * exposed in the wrapping component have the same name and structure as in this component.
 * Such props don't need to be documented, as the user can simply reference the [eCharts configuration](https://echarts.apache.org/en/option.html) docs.
 * All non-standard props on the other hand are expected to be documented.
 *
 * The wrapper is configured to use the `replaceMerge` update strategy, meaning that series
 * without the `id` field will be replaced on updates (which may cause visible flicker),
 * and series with the `id` field will be merged with the new series config with the same `id`.
 */
const Chart = React.forwardRef<ChartApi, ChartProps>((props, ref) => {
  const { theme, initOptions = defaultInitOptions } = props;
  const { height: explicitHeight, width: explicitWidth } = initOptions;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setChartApi] = useState<ChartApi>();
  const chartApiRef = useRef<ChartApi>();
  const createChart = useCallback(() => {
    // The chart theme and the rendering backend are only specified at instantiation time and cannot be changed on a live chart
    // after it's been created. This is the limitation of eCharts API, which we work around by reinstantiating
    // the chart on `theme` and `renderer` prop changes.
    const container = chartContainerRef.current as HTMLDivElement;
    const chart = (echarts.init as EChartInit)(initOptions?.ssr ? undefined : container, theme, initOptions);
    chartApiRef.current = chart;
    setChartApi(chart); // Rerender the component after the chart has been instantiated.
    return chart;
  }, [initOptions, theme]);

  // Autosize the chart to fill the container div.
  const resizeObserver = useMemo<ResizeObserver>(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height, width } = entry.contentRect;
          const chart = chartApiRef.current;
          if (chart && !(explicitWidth && explicitHeight)) {
            chart.resize({
              height,
              width,
            });
          }
        }
      }),
    [explicitWidth, explicitHeight]
  );

  useImperativeHandle(ref, () => createChart(), [createChart]);

  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    resizeObserver.observe(chartContainer);
    const chart = createChart();

    return () => {
      resizeObserver.unobserve(chartContainer);
      chart.dispose();
    };
  }, [createChart, resizeObserver]);

  const chart = chartApiRef.current;
  if (chart) {
    if (explicitWidth && explicitHeight) {
      chart.resize({
        height: explicitHeight,
        width: explicitWidth,
      });
    }
    // Chart props are effectively eCharts options and we rely on eCharts internal option diffing.
    chart.setOption(
      props,
      props.setOptions
        ? {
            ...defaultSetOptions,
            ...props.setOptions,
          }
        : defaultSetOptions
    );
  }

  const chartContainer = chartContainerRef.current;
  // `renderToSVGString` is the way eCharts are meant to be rendered when server-side rendering is enabled:
  // https://apache.github.io/echarts-handbook/en/how-to/cross-platform/server/
  const svgString = props?.initOptions?.ssr && chart?.renderToSVGString();
  let innerHTML: DOMAttributes<unknown>['dangerouslySetInnerHTML'] = undefined;
  if (chartContainer && svgString) {
    innerHTML = {
      __html: svgString,
    };
  }

  return <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={innerHTML} ref={chartContainerRef} />;
}) as FC<ChartProps>;

const defaultInitOptions: ChartInitOptions = {
  renderer: 'canvas',
};

const defaultSetOptions: echarts.SetOptionOpts = {
  replaceMerge: ['series', 'xAxis', 'yAxis'],
};

export { Chart as default, echarts, zrender };
