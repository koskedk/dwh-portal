import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import { Card, CardBody, CardHeader } from 'reactstrap';
import HighchartsReact from 'highcharts-react-official';
import { capitalize, getAll } from '../../Shared/Api';
import moment from "moment";

const AppointmentDurationStableByPartner = () => {
    const filters = useSelector(state => state.filters);
    const [appointmentDurationStableByPartner, setAppointmentDurationStableByPartner] = useState({});

    const loadAppointmentDurationStableByPartner = useCallback(async () => {
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
        const appointmentCategories = ['<3 Months', '> 3 Months'];
        const partnerCategories = [];
        const result = await getAll('care-treatment/dsdAppointmentDurationByPartner', params);
        let data = [];
        for(let i = 0; i < result.length; i++) {
            if(partnerCategories.indexOf(result[i].partner) === -1){
                partnerCategories.push(result[i].partner);
            }
        }
        // seed all values sp that missing values default to 0
        for(let i = 0; i < appointmentCategories.length; i++) {
            data[i] = [];
            for(let j = 0; j < partnerCategories.length; j++) {
                data[i][j] = 0;
            }
        }
        for(let i = 0; i < result.length; i++) {
            let appointmentIndex = appointmentCategories.indexOf(result[i].AppointmentsCategory);
            let ageIndex = partnerCategories.indexOf(result[i].partner);
            if(appointmentIndex === -1 || ageIndex === -1 ) { // unsupported
                continue;
            }
            data[appointmentIndex][ageIndex] = data[appointmentIndex][ageIndex] + parseInt(result[i].patients);
        }
        setAppointmentDurationStableByPartner({
            title: { text: '' },
            xAxis: [{ categories: partnerCategories.map(p => capitalize(p)), crosshair: true }],
            yAxis: [{ title: { text: 'Percentage of Patients' }}],
            tooltip: { shared: true },
            plotOptions: { column: { stacking: 'percent' } },
            legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
            series: [
                { name: 'NON MMD', data: data[1], type: 'column', color: "#485969", tooltip: { valueSuffix: ' ({point.percentage:.0f}%)' } },
                { name: 'MMD', data: data[0], type: 'column', color: "#1AB394", tooltip: { valueSuffix: ' ({point.percentage:.0f}%)' } },
            ]
        });
    }, [filters]);

    useEffect(() => {
        loadAppointmentDurationStableByPartner();
    }, [loadAppointmentDurationStableByPartner]);

    return (
        <div className="row">
            <div className="col-12">
                <Card className="trends-card">
                    <CardHeader className="trends-header">
                        MMD UPTAKE IN PATIENTS CURRENTLY ON ART BY PARTNER
                    </CardHeader>
                    <CardBody className="trends-body">
                        <div className="col-12">
                            <HighchartsReact highcharts={Highcharts} options={appointmentDurationStableByPartner} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AppointmentDurationStableByPartner;
