import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";


class WeightBreakdown extends Component {
    constructor(props) {
        super(props);
        am4core.useTheme(am4themes_animated)
        am4core.useTheme(am4themes_dark);
        this.chartName = "chartdiv"
        this.chartDiv = React.createRef();
        this.resizeLegend = this.resizeLegend.bind(this);
        this.state = ({
            nestedSubs: null,
            currentBreakdown: null,
            currentSelection: null
        })
        this.generateChartData = this.generateChartData.bind(this);
        this.resetPieChart = this.resetPieChart.bind(this);
    }

    resetPieChart() {
        this.selected = null;
        this.setState({
            nestedSubs: null,
            currentBreakdown: null,
            currentSelection: null
        }, (this.generateChartData))
    }

    setCurrentBreakdownName(breakdownName) {
        this.setState({
            currentBreakdown: breakdownName
        })
    }
    setCurrentSelection(selection) {
        this.setState({
            currentSelection: selection
        })
    }

    pieChartOnClick(event) {
        if (event.target.dataItem.dataContext.breakdown) {
            this.setCurrentBreakdownName(event.target.dataItem.dataContext.type);
            this.setState({
                nestedSubs: event.target.dataItem.dataContext.breakdown
            }, (this.generateChartData))
        } else if (event.target.dataItem.dataContext.id !== undefined) {
            this.selected = event.target.dataItem.dataContext.id;
            this.setState({
                currentSelection: event.target.dataItem.dataContext.type
            })
            this.generateChartData();
        }
    }

    resizeLegend(ev) {
        this.refs.legendDiv.style.height = this.chart.legend.contentHeight + "px";
    }

    getChartDataForNestedSubs(nestedSubs) {
        let chartData = [];
        for (var i = 0; i < nestedSubs.length; i++) {
            chartData.push({
                type: nestedSubs[i].name,
                percent: nestedSubs[i].weight,
                breakdown: nestedSubs[i].breakdown
            })
        }

        return chartData;
    }

    generateChartData() {
        let types = this.props.types;
        if (this.state.nestedSubs) {
            this.chart.data = this.getChartDataForNestedSubs(this.state.nestedSubs);
            return;
        }
        var chartData = [];
        for (var i = 0; i < types.length; i++) {
            if (i === this.selected) {
                for (var x = 0; x < types[i].subs.length; x++) {
                    chartData.push({
                        type: types[i].subs[x].name,
                        percent: types[i].subs[x].weight,
                        color: this.chart.colors.getIndex(x + types.length), // shift the colours away from ones used for types.
                        pulled: true,
                        breakdown: types[i].subs[x].breakdown
                    });
                }
            } else {
                chartData.push({
                    type: types[i].type,
                    percent: types[i].percent,
                    color: this.chart.colors.getIndex(i),
                    id: i
                });
            }
        }
        this.chart.data = chartData;
    }

    componentDidMount() {
        let chart = am4core.create(this.chartName, am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.legend = new am4charts.Legend();

        this.chart = chart;
        this.generateChartData();

        let series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "percent";
        series.dataFields.category = "type";
        series.slices.template.propertyFields.fill = "color";
        series.slices.template.strokeWidth = 0;
        series.slices.template.events.on("hit", this.pieChartOnClick, this);
        chart.legend.valueLabels.template.text = "{value.value} tonnes";

        // Legend 
        var legendContainer = am4core.create("legenddivweight", am4core.Container);
        legendContainer.width = am4core.percent(100);
        legendContainer.height = am4core.percent(100);
        chart.legend.parent = legendContainer;
        chart.legend.valueLabels.template.text = "{value.value} tonnes";

        this.chart.events.on("datavalidated", this.resizeLegend);
        this.chart.events.on("maxsizechanged", this.resizeLegend);

        series.labels.template.adapter.add("text", (label, target, key) => {
            if (target.dataItem.value > 100 && series.labels.length <= 10) {
                return label;
            }
        });
    }

    render() {
        let breakdownTitle;
        breakdownTitle = <div className="breakdown-subtitle">{'You are viewing the breakdown of ' + this.state.currentBreakdown}</div>
        let selectionTitle;
        selectionTitle = <div className="breakdown-subtitle">{this.state.currentSelection + ' Weight'}</div>
        return (
            <div>
                <div className="reset-chart-button-container">
                    <button class="button is-primary" onClick={this.resetPieChart}>
                        <i className="fas fa-undo"></i>
                        Reset chart
                    </button>
                </div>
                {this.state.currentSelection && selectionTitle}
                {this.state.currentBreakdown && breakdownTitle}
                <div id={this.chartName} className="chart" ref={this.chartDiv}></div>
                <div className="legend-wrapper">
                    <div id="legenddivweight" className="legend" style={{ height: '100px' }} ref="legendDiv"></div>
                </div>
            </div>
        );
    }
}

export default WeightBreakdown;