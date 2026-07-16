<template>
    <div class="_fc-chart" :style="{width: width, height: height}">
        <div ref="chartRef" class="_fc-chart__canvas"></div>
        <div v-if="empty" class="_fc-chart__empty">{{ resolvedEmptyText }}</div>
    </div>
</template>

<script>
import {computed, defineComponent, ref, watch, onMounted, onBeforeUnmount, nextTick, markRaw} from 'vue';
import * as echarts from 'echarts';

function formatValue(template, value) {
    if (!template || template === '{value}') return value;
    return template.replace(/\{value\}/g, value);
}

function numericValue(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function buildProportionData(data) {
    const category = Array.isArray(data.category) ? data.category : [];
    const series = Array.isArray(data.series) ? data.series : [];
    const points = [];

    series.forEach(seriesItem => {
        const values = Array.isArray(seriesItem.data) ? seriesItem.data : [];
        values.forEach((item, index) => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                points.push({
                    ...item,
                    name: item.name == null ? (category[index] || seriesItem.name || String(index + 1)) : item.name,
                    value: numericValue(item.value),
                });
            }
        });
    });
    if (points.length) return points;

    if (series.length === 1 && Array.isArray(series[0].data) && category.length) {
        return series[0].data.map((value, index) => ({
            name: category[index] == null ? String(index + 1) : category[index],
            value: numericValue(value),
        }));
    }

    return series.map(seriesItem => ({
        name: seriesItem.name,
        value: (Array.isArray(seriesItem.data) ? seriesItem.data : [])
            .reduce((total, value) => total + numericValue(value), 0),
    }));
}

function buildOption(chartType, data, config) {
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
        averageLineName = '平均值',
    } = config || {};
    const proportionData = (chartType === 'pie' || chartType === 'funnel')
        ? buildProportionData(data)
        : [];

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
        return {
            ...titleOption,
            ...tooltipFormatter,
            legend: {bottom: '0%'},
            series: [{
                type: 'pie',
                radius: '60%',
                top: chartName || chartDescription ? 30 : 0,
                data: proportionData,
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
        const funnelData = proportionData.slice().sort((a, b) => b.value - a.value);
        const maxVal = Math.max(0, ...funnelData.map(item => item.value));
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
                        {type: 'average', name: averageLineName}
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
        modelValue: {
            type: Object,
            default: undefined,
        },
        chartType: {
            type: String,
            default: 'line'
        },
        chartData: {
            type: Object,
            default: undefined
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
        averageLineName: {
            type: String,
            default: ''
        },
        emptyText: {
            type: String,
            default: ''
        },
        formCreateInject: Object,
    },
    setup(props) {
        const chartRef = ref(null);
        const empty = ref(false);
        const resolvedEmptyText = computed(() => props.emptyText
            || (props.formCreateInject && props.formCreateInject.t && props.formCreateInject.t('com.fcChart.emptyDataText'))
            || '暂无数据');
        const resolvedAverageLineName = computed(() => props.averageLineName
            || (props.formCreateInject && props.formCreateInject.t && props.formCreateInject.t('com.fcChart.averageLineDefault'))
            || '平均值');
        let chart = null;
        let resizeObserver = null;

        const renderChart = () => {
            if (!chart) return;
            const data = props.modelValue == null ? props.chartData : props.modelValue;
            if (!data || !Array.isArray(data.series)
                || !data.series.some(item => item && Array.isArray(item.data) && item.data.length > 0)) {
                empty.value = true;
                chart.clear();
                return;
            }
            empty.value = false;
            const option = buildOption(props.chartType, data, {
                chartName: props.chartName,
                chartDescription: props.chartDescription,
                valueFormat: props.valueFormat,
                stack: props.stack,
                smooth: props.smooth,
                showSymbol: props.showSymbol,
                showLabel: props.showLabel,
                showAverageLine: props.showAverageLine,
                averageLineName: resolvedAverageLineName.value,
            });
            chart.setOption(option, true);
        };

        onMounted(() => {
            nextTick(() => {
                if (chartRef.value) {
                    chart = markRaw(echarts.init(chartRef.value));
                    renderChart();
                    if (typeof ResizeObserver !== 'undefined') {
                        resizeObserver = new ResizeObserver(() => {
                            chart && chart.resize();
                        });
                        resizeObserver.observe(chartRef.value);
                    }
                }
            });
        });

        watch(() => props.chartType, renderChart);
        watch(() => props.modelValue, renderChart, {deep: true});
        watch(() => props.chartData, renderChart, {deep: true});
        watch(() => props.chartName, renderChart);
        watch(() => props.chartDescription, renderChart);
        watch(() => props.valueFormat, renderChart);
        watch(() => props.stack, renderChart);
        watch(() => props.smooth, renderChart);
        watch(() => props.showSymbol, renderChart);
        watch(() => props.showLabel, renderChart);
        watch(() => props.showAverageLine, renderChart);
        watch(() => props.averageLineName, renderChart);

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

        return {chartRef, empty, resolvedEmptyText};
    }
});
</script>

<style scoped>
._fc-chart {
    position: relative;
}

._fc-chart__canvas {
    width: 100%;
    height: 100%;
}

._fc-chart__empty {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary, #909399);
    font-size: 14px;
}
</style>
