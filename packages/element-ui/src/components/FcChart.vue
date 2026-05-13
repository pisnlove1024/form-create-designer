<template>
    <div ref="chartRef" :style="{width: width, height: height}"></div>
</template>

<script>
import {defineComponent, ref, watch, onMounted, onBeforeUnmount, nextTick, markRaw} from 'vue';
import * as echarts from 'echarts';

const defaultChartData = {
    category: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    series: [
        {name: '数据A', data: [120, 132, 101, 134, 90, 230, 210]},
        {name: '数据B', data: [220, 182, 191, 234, 290, 330, 310]},
        {name: '数据C', data: [150, 232, 201, 154, 190, 330, 410]},
        {name: '数据D', data: [320, 332, 301, 334, 390, 330, 320]},
        {name: '数据E', data: [820, 932, 901, 934, 1290, 1330, 1320]},
    ]
};

function formatValue(template, value) {
    if (!template || template === '{value}') return value;
    return template.replace(/\{value\}/g, value);
}

function buildOption(chartType, data, config) {
    if (!data || !data.series) {
        data = defaultChartData;
    }
    const category = data.category || [];
    const series = data.series || [];
    const {
        chartName = '',
        chartDescription = '',
        valueFormat = '{value}',
        stack = false,
        smooth = false,
        showSymbol = true,
        showLabel = false,
        showAverageLine = false,
    } = config || {};

    const titleOption = (chartName || chartDescription) ? {
        title: {
            text: chartName,
            subtext: chartDescription,
            left: 'center',
        }
    } : {};

    const tooltipFormatter = valueFormat && valueFormat !== '{value}' ? {
        tooltip: {
            trigger: chartType === 'pie' || chartType === 'funnel' ? 'item' : 'axis',
            valueFormatter: (val) => formatValue(valueFormat, val),
        }
    } : {
        tooltip: {trigger: chartType === 'pie' || chartType === 'funnel' ? 'item' : 'axis'}
    };

    const labelConfig = showLabel ? {
        label: {
            show: true,
            formatter: valueFormat && valueFormat !== '{value}'
                ? (params) => formatValue(valueFormat, params.value)
                : undefined,
        }
    } : {label: {show: false}};

    if (chartType === 'pie') {
        const pieData = series.map(s => {
            const total = (s.data || []).reduce((a, b) => a + b, 0);
            return {name: s.name, value: total};
        });
        return {
            ...titleOption,
            ...tooltipFormatter,
            legend: {bottom: '0%'},
            series: [{
                type: 'pie',
                radius: '60%',
                top: chartName || chartDescription ? 30 : 0,
                data: pieData,
                ...labelConfig,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }

    if (chartType === 'funnel') {
        const maxVal = Math.max(...series.map(s => (s.data || []).reduce((a, b) => a + b, 0)));
        const funnelData = series.map(s => {
            const total = (s.data || []).reduce((a, b) => a + b, 0);
            return {name: s.name, value: total};
        }).sort((a, b) => b.value - a.value);
        return {
            ...titleOption,
            ...tooltipFormatter,
            legend: {bottom: '0%'},
            series: [{
                type: 'funnel',
                left: '10%',
                top: chartName || chartDescription ? 50 : 20,
                bottom: 40,
                width: '80%',
                min: 0,
                max: maxVal,
                sort: 'descending',
                gap: 2,
                label: {show: true, position: 'inside',
                    formatter: showLabel && valueFormat && valueFormat !== '{value}'
                        ? (params) => formatValue(valueFormat, params.value)
                        : undefined,
                },
                data: funnelData
            }]
        };
    }

    const isHorizontal = chartType === 'horizontalBar';
    const echartsType = (chartType === 'bar' || isHorizontal) ? 'bar' : 'line';

    const categoryAxis = {type: 'category', data: category};
    const valueAxis = {type: 'value'};
    if (valueFormat && valueFormat !== '{value}') {
        valueAxis.axisLabel = {formatter: (val) => formatValue(valueFormat, val)};
    }

    const option = {
        ...titleOption,
        ...tooltipFormatter,
        legend: {bottom: '0%'},
        grid: {left: '3%', right: '4%', bottom: '12%', top: chartName || chartDescription ? 60 : 30, containLabel: true},
        xAxis: isHorizontal ? valueAxis : categoryAxis,
        yAxis: isHorizontal ? categoryAxis : valueAxis,
        series: series.map((s, index) => {
            const item = {
                name: s.name,
                type: echartsType,
                data: s.data || [],
                ...labelConfig,
            };
            if (stack) {
                item.stack = 'total';
            }
            if (chartType === 'area') {
                item.areaStyle = {};
            }
            if (echartsType === 'line') {
                item.smooth = smooth;
                item.showSymbol = showSymbol;
            }
            if (showAverageLine && index === 0) {
                item.markLine = {
                    silent: true,
                    lineStyle: {
                        type: 'dashed',
                    },
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                };
            }
            return item;
        })
    };

    return option;
}

export default defineComponent({
    name: 'FcChart',
    props: {
        chartType: {
            type: String,
            default: 'line'
        },
        chartData: {
            type: Object,
            default: () => defaultChartData
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        chartName: {
            type: String,
            default: ''
        },
        chartDescription: {
            type: String,
            default: ''
        },
        valueFormat: {
            type: String,
            default: '{value}'
        },
        stack: {
            type: Boolean,
            default: false
        },
        smooth: {
            type: Boolean,
            default: false
        },
        showSymbol: {
            type: Boolean,
            default: true
        },
        showLabel: {
            type: Boolean,
            default: false
        },
        showAverageLine: {
            type: Boolean,
            default: false
        },
    },
    setup(props) {
        const chartRef = ref(null);
        let chart = null;
        let resizeObserver = null;

        const renderChart = () => {
            if (!chart) return;
            const option = buildOption(props.chartType, props.chartData, {
                chartName: props.chartName,
                chartDescription: props.chartDescription,
                valueFormat: props.valueFormat,
                stack: props.stack,
                smooth: props.smooth,
                showSymbol: props.showSymbol,
                showLabel: props.showLabel,
                showAverageLine: props.showAverageLine,
            });
            chart.setOption(option, true);
        };

        onMounted(() => {
            nextTick(() => {
                if (chartRef.value) {
                    chart = markRaw(echarts.init(chartRef.value));
                    renderChart();
                    resizeObserver = new ResizeObserver(() => {
                        chart && chart.resize();
                    });
                    resizeObserver.observe(chartRef.value);
                }
            });
        });

        watch(() => props.chartType, renderChart);
        watch(() => props.chartData, renderChart, {deep: true});
        watch(() => props.chartName, renderChart);
        watch(() => props.chartDescription, renderChart);
        watch(() => props.valueFormat, renderChart);
        watch(() => props.stack, renderChart);
        watch(() => props.smooth, renderChart);
        watch(() => props.showSymbol, renderChart);
        watch(() => props.showLabel, renderChart);
        watch(() => props.showAverageLine, renderChart);

        onBeforeUnmount(() => {
            if (resizeObserver && chartRef.value) {
                resizeObserver.unobserve(chartRef.value);
                resizeObserver = null;
            }
            if (chart) {
                chart.dispose();
                chart = null;
            }
        });

        return {chartRef};
    }
});
</script>
