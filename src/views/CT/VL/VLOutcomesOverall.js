import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from 'reactstrap';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getAll } from '../../Shared/Api';
import moment from "moment";

const VLOutcomesOverall = () => {
    const filters = useSelector(state => state.filters);
    const [vlOutcomesOverall, setVLOutcomesOverall] = useState({});

    const loadVLOutcomesOverall = useCallback(async () => {
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
        const vlOutcomesCategories = ['SUPPRESSED', 'HVL', 'LLV'];
        const result = await getAll('care-treatment/vlOutcomesOverall', params);
        let data = [0, 0, 0];
        for(let i = 0; i < result.length; i++) {
            for(let j = 0; j < vlOutcomesCategories.length; j++) {
                if (result[i].outcome === vlOutcomesCategories[j]) {
                    data[j] = data[j] + parseInt(result[i].count);
                }
            }
        }
        setVLOutcomesOverall({
            chart: { type: 'pie' },
            title: { text: 'OVERALL', align: 'center', verticalAlign: 'middle'},
            subtitle: { text: '' },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    },
                    innerSize: '75%',
                }
            },
            series: [{
                name:"Overall VL Outcomes",
                colorByPoint: true,
                data: [
                    { name: 'SUPPRESSED', y: data[0], color: "#485969" },
                    { name: 'HVL', y: data[1], color: "#1AB394" },
                    { name: 'LLV', y: data[2], color: "#BBE65F" },
                ]
            }]
        });
    }, [filters]);

    useEffect(() => {
        loadVLOutcomesOverall();
    }, [loadVLOutcomesOverall]);

    return (
        <div className="row">
            <div className="col-12">
                <Card className="trends-card">
                    <CardHeader className="trends-header">
                        OVERALL VL OUTCOMES AMONG TXCURR PATIENTS
                    </CardHeader>
                    <CardBody className="trends-body">
                        <div className="col-12">
                            <HighchartsReact highcharts={Highcharts} options={vlOutcomesOverall} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VLOutcomesOverall;
