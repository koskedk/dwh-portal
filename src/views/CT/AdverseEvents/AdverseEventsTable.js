import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { getAll } from '../../Shared/Api';
import moment from "moment";
import * as _ from 'lodash';

const AdverseEventsTable = () => {
    const filters = useSelector(state => state.filters);
    const [adverseEvents, setAdverseEvents] = useState({});

    const loadAdverseEvents = useCallback(async () => {
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
        const aeDistributionBySeverity = await getAll('care-treatment/getAeTypesBySeverity', params);
        const data = [];

        const ae = _.uniqBy(aeDistributionBySeverity, obj => obj.AdverseEvent);

        for (let i = 0; i < ae.length; i++) {
            const freqAeArray = aeDistributionBySeverity.filter(obj => obj.AdverseEvent === ae[i].AdverseEvent);
            const freqAe = freqAeArray.length > 0 ? freqAeArray.map(item => item.total).reduce((x, y) => x + y) : 0;
            const mildArray = freqAeArray.filter(obj => obj.Severity === "Mild");
            const moderateArray = freqAeArray.filter(obj => obj.Severity === "Moderate");
            const severeArray = freqAeArray.filter(obj => obj.Severity === "Severe");
            const unknownArray = freqAeArray.filter(obj => obj.Severity === "Unknown");
            const mild = mildArray.length > 0 ? mildArray.map(item => item.total).reduce((x, y) => x + y) : 0;
            const moderate = moderateArray.length > 0 ? moderateArray.map(item => item.total).reduce((x, y) => x + y) : 0;
            const severe = severeArray.length > 0 ? severeArray.map(item => item.total).reduce((x, y) => x + y) : 0;
            const unknown = unknownArray.length > 0 ? unknownArray.map(item => item.total).reduce((x, y) => x + y) : 0;

            data.push({
                aeName: ae[i].AdverseEvent,
                freqAe: freqAe,
                mild: mild,
                moderate: moderate,
                severe: severe,
                unknown: unknown
            });
        }

        setAdverseEvents({
            columns: [
                {
                    name: 'AE NAME', selector: 'aeName', sortable: true
                },
                {
                    name: 'FREQUENCY OF AE', selector: 'freqAe', sortable: true
                },
                {
                    name: 'MILD', selector: 'mild', sortable: true
                },
                {
                    name: 'MODERATE', selector: 'moderate', sortable: true
                },
                {
                    name: 'SEVERE', selector: 'severe', sortable: true
                },
                {
                    name: 'UNKNOWN', selector: 'unknown', sortable: true
                }
            ],
            data: data
        });
    }, [filters]);

    useEffect(() => {
        loadAdverseEvents();
    }, [loadAdverseEvents]);

    return (
        <div className="row">
            <div className="col-12">
                <Card className="trends-card">
                    <CardHeader className="trends-header">
                        ADVERSE EVENTS
                    </CardHeader>
                    <CardBody className="trends-body">
                        <div className="col-12">
                            <DataTable columns={adverseEvents.columns} data={adverseEvents.data} pagination={true} defaultSortField="aeName" responsive={true}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AdverseEventsTable;
