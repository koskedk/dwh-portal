import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from 'reactstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { getAll } from '../../Shared/Api';
import moment from "moment";

const CurrentOnARTTxCurrDistributionByCounty = () => {
    const filters = useSelector(state => state.filters);
    const [txCurrDistributionByCounty, setTxCurrDistributionByCounty] = useState({});

    const loadTxCurrDistributionByCounty = useCallback(async () => {
        let params = {
            county: filters.counties,
            subCounty: filters.subCounties,
            facility: filters.facilities,
            partner: filters.partners,
            agency: filters.agencies,
            project: filters.projects,
            year: filters.fromDate ? moment(filters.fromDate, "MMM YYYY").format("YYYY"):'',
        };
        params.month = filters.fromDate ? moment(filters.fromDate, "MMM YYYY").format("MM") : '';
        const counties = [];
        const txCurr = [];

        const result = await getAll('care-treatment/txCurrDistributionByCounty', params);
        for(let i = 0; i < result.length; i++) {
            counties.push(result[i].County);
            txCurr.push(result[i].txCurr);
        }

        setTxCurrDistributionByCounty({
            chart: {
                type: 'column'
            },
            title: { useHTML: true, text: ' &nbsp;', align: 'left' },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: counties,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            legend: {
                floating: true, layout: 'horizontal', align: 'left', verticalAlign: 'top', y: 0, x: 80,
                backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: { column: { pointPadding: 0.2, borderWidth: 0, dataLabels: { enabled: true, crop: false, overflow: 'none' } } },
            series: [{
                name: 'Number currently on ART',
                color: "#485969",
                data: txCurr
            }]
        });
    }, [filters]);

    useEffect(() => {
        loadTxCurrDistributionByCounty();
    }, [loadTxCurrDistributionByCounty]);

    return (
        <div className="row">
            <div className="col-12">
                <Card className="trends-card">
                    <CardHeader className="trends-header">
                        Distribution of Patients currently on ART by County
                    </CardHeader>
                    <CardBody className="trends-body">
                        <HighchartsReact highcharts={Highcharts} options={txCurrDistributionByCounty} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default CurrentOnARTTxCurrDistributionByCounty;
