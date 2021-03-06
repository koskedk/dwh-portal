import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from 'reactstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getAll } from '../../Shared/Api';
import moment from "moment";

const AdverseEventsTiles = () => {
    const filters = useSelector(state => state.filters);
    const [adults15PlusCurrentOnART, setAdults15PlusCurrentOnART] = useState({
        adults15PlusCurrentOnART: ''
    });
    const [childrenUnder15CurrentOnART, setChildrenUnder15CurrentOnART] = useState({
        childrenUnder15CurrentOnART: ''
    });
    const [under15AdverseEventsDesegregation, setUnder15AdverseEventsDesegregation] = useState({});
    // const [totalChildrenAdverseEvents, setTotalChildrenAdverseEvents] = useState({
    //     total: ''
    // });
    const [adults15PlusAdverseEventsDesegregation, setAdults15PlusAdverseEventsDesegregation] = useState({});
    const [totalAdultsAdverseEvents, setTotalAdultsAdverseEvents] = useState({
        total: ''
    });

    const [totalNoOfAeReportedInAdults, setTotalNoOfAeReportedInAdults] = useState({
        total: ''
    });

    const [totalNoOfAeReportedInChildren, setTotalNoOfAeReportedInChildren] = useState({
        total: ''
    });

    const [totalNumberOfAdultsWithAe, setTotalNumberOfAdultsWithAe] = useState({
        total: ''
    });

    const [totalNumberOfChildrenWithAe, setTotalNumberOfChildrenWithAe] = useState({
        total: ''
    });

    const loadActiveOnARTAdults = useCallback(async () => {
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
        let ActiveARTAdults = 0;

        const result = await getAll('care-treatment/activeArtAdults', params);
        if(result && result.length > 0) {
            ActiveARTAdults = result[0].ActiveARTAdults;
        }

        setAdults15PlusCurrentOnART({
            adults15PlusCurrentOnART: ActiveARTAdults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        });
    }, [filters]);

    const loadActiveOnARTChildren = useCallback(async () => {
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
        let ActiveARTChildren = 0;

        const result = await getAll('care-treatment/activeArtChildren', params);
        if(result && result.length > 0) {
            ActiveARTChildren = result[0].ActiveARTChildren;
        }

        setChildrenUnder15CurrentOnART({
            childrenUnder15CurrentOnART: ActiveARTChildren ? ActiveARTChildren.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0
        });
    }, [filters]);

    const loadUnder15AdverseEventsDesegregation =  useCallback(async () => {
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
        let maleData = [];
        let femaleData = [];
        const categories = ['Under 1', '1 to 4', '5 to 9', '10 to 14'];
        const result = await getAll('care-treatment/getChildrenAdverseEvents', params);
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if(categories[i] === result[j].AgeGroup && (result[j].Gender.toLowerCase() === "female" || result[j].Gender.toLowerCase() === "f" )) {
                    femaleData.push(result[j].total);
                }

                if(categories[i] === result[j].AgeGroup && (result[j].Gender.toLowerCase() === "male" || result[j].Gender.toLowerCase() === "m" )) {
                    maleData.push(result[j].total);
                }
            }
        }
        // const total_Male = maleData.reduce((a, b) => a + b, 0);
        // const total_female = femaleData.reduce((a, b) => a + b, 0);
        // const total = total_Male + total_female;

        // setTotalChildrenAdverseEvents({
        //     total: total
        // });

        setUnder15AdverseEventsDesegregation({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: categories.map(y => y + ' YRS')
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Patients'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 7,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || // theme
                    'rgba(255,255,255,0.25)'
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Male',
                color: "#14084D",
                data: maleData
            }, {
                name: 'Female',
                color: "#EA4C8B",
                data: femaleData
            }]
        });
    }, [filters]);

    const loadAdults15PlusAdverseEventsDesegregation =  useCallback(async () => {
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
        let maleData = [];
        let femaleData = [];
        const categories = ['15 to 19', '20 to 24','25 to 29', '30 to 34', '35 to 39', '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64', '65+'];
        const result = await getAll('care-treatment/getAdultsAdverseEvents', params);
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if(categories[i] === result[j].AgeGroup && (result[j].Gender.toLowerCase() === "female" || result[j].Gender.toLowerCase() === "f" )) {
                    femaleData.push(result[j].total);
                }

                if(categories[i] === result[j].AgeGroup && (result[j].Gender.toLowerCase() === "male" || result[j].Gender.toLowerCase() === "m" )) {
                    maleData.push(result[j].total);
                }
            }
        }
        const total_Male = maleData.reduce((a, b) => a + b, 0);
        const total_female = femaleData.reduce((a, b) => a + b, 0);
        const total = total_Male + total_female;

        setTotalAdultsAdverseEvents({
            total: total
        });

        setAdults15PlusAdverseEventsDesegregation({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: categories.map(y => y + ' YRS')
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Patients'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 7,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || // theme
                    'rgba(255,255,255,0.25)'
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Male',
                color: "#14084D",
                data: maleData
            }, {
                name: 'Female',
                color: "#EA4C8B",
                data: femaleData
            }]
        });
    }, [filters]);

    const loadTotalNoOfAeReportedInAdults = useCallback(async () => {
        let params = null;

        if (filters) {
            params = { ...filters };
        }
        const result = await getAll('care-treatment/getNoOfReportedAeInAdults', params);
        if (result) {
            setTotalNoOfAeReportedInAdults({
                total: result.total ? result.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","): 0
            });
        }
    }, [filters]);

    const loadTotalNoOfAeReportedInChildren = useCallback(async () => {
        let params = null;

        if (filters) {
            params = { ...filters };
        }
        const result = await getAll('care-treatment/getNoOfReportedAeInChildren', params);
        if (result) {
            setTotalNoOfAeReportedInChildren({
                total: result.total ? result.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0
            });
        }
    }, [filters]);

    const loadTotalNoAdultsWithAe = useCallback(async () => {
        let params = null;

        if (filters) {
            params = { ...filters };
        }
        const result = await getAll('care-treatment/getNumberOfAdultsWithAe', params);
        if (result) {
            setTotalNumberOfAdultsWithAe({
                total: result.total ? result.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0
            });
        }
    }, [filters]);

    const loadTotalNoChildrenWithAe = useCallback(async () => {
        let params = null;

        if (filters) {
            params = { ...filters };
        }
        const result = await getAll('care-treatment/getNumberOfChildrenWithAe', params);
        if (result) {
            setTotalNumberOfChildrenWithAe({
                total: result.total ? result.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0
            });
        }
    }, [filters]);

    useEffect(() => {
        loadActiveOnARTAdults();
        loadActiveOnARTChildren();
        loadUnder15AdverseEventsDesegregation();
        loadAdults15PlusAdverseEventsDesegregation();
        loadTotalNoOfAeReportedInAdults();
        loadTotalNoOfAeReportedInChildren();
        loadTotalNoAdultsWithAe();
        loadTotalNoChildrenWithAe();
    }, [loadActiveOnARTAdults, loadActiveOnARTChildren, loadUnder15AdverseEventsDesegregation, loadAdults15PlusAdverseEventsDesegregation, loadTotalNoOfAeReportedInAdults, loadTotalNoOfAeReportedInChildren, loadTotalNoAdultsWithAe, loadTotalNoChildrenWithAe]);

    return (
        <span>
            <div className="row">
                <div className="col-4">
                    <Card className="card-uploads-consistency-rates">
                        <CardHeader className="expected-uploads-header">
                            ADULTS 15+ CURRENTLY ON ART
                        </CardHeader>
                        <CardBody
                            className="align-items-center d-flex justify-content-center"
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#F6F6F6',
                                height: '100px'
                            }}
                        >
                            <div className="col-12">
                                <span className="expected-uploads-text">{adults15PlusCurrentOnART.adults15PlusCurrentOnART}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="col-4">
                    <Card className="card-uploads-consistency-rates">
                        <CardHeader className="expected-uploads-header">
                            ADULTS 15+ ON ART AND DEVELOPED AEs
                        </CardHeader>
                        <CardBody
                            className="align-items-center d-flex justify-content-center"
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#F6F6F6',
                                height: '100px'
                            }}
                        >
                            <div className="col-12">
                                <span className="expected-uploads-text">{totalNumberOfAdultsWithAe.total}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="col-4">
                    <Card className="card-uploads-consistency-rates">
                        <CardHeader className="expected-uploads-header">
                            NUMBER OF AEs REPORTED CASES IN ADULTS 15+
                        </CardHeader>
                        <CardBody
                            className="align-items-center d-flex justify-content-center"
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#F6F6F6',
                                height: '100px'
                            }}
                        >
                            <div className="col-12">
                                <span className="expected-uploads-text">{totalNoOfAeReportedInAdults.total}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="row">
                <div className="col-4">
                    <Card className="card-uploads-consistency-rates">
                        <CardHeader className="expected-uploads-header">
                            CHILDREN CURRENTLY ON ART
                        </CardHeader>
                        <CardBody
                            className="align-items-center d-flex justify-content-center"
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#F6F6F6',
                                height: '100px'
                            }}
                        >
                            <div className="col-12">
                                <span className="expected-uploads-text">
                                    {childrenUnder15CurrentOnART.childrenUnder15CurrentOnART}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="col-4">
                    <Card className="card-uploads-consistency-rates">
                        <CardHeader className="expected-uploads-header">
                            CHILDREN ON ART AND DEVELOPED AEs
                        </CardHeader>
                        <CardBody
                            className="align-items-center d-flex justify-content-center"
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#F6F6F6',
                                height: '100px'
                            }}
                        >
                            <div className="col-12">
                                <span className="expected-uploads-text">{totalNumberOfChildrenWithAe.total}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="col-4">
                    <Card className="card-uploads-consistency-rates">
                        <CardHeader className="expected-uploads-header">
                            NUMBER OF AEs REPORTED CASES IN CHILDREN
                        </CardHeader>
                        <CardBody
                            className="align-items-center d-flex justify-content-center"
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#F6F6F6',
                                height: '100px'
                            }}
                        >
                            <div className="col-12">
                                <span className="expected-uploads-text">{totalNoOfAeReportedInChildren.total}</span>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="row">
                <div className="col-6">
                    <Card className="trends-card">
                        <CardHeader className="trends-header">
                            CHILDREN &#60;15 ON ART AND DEVELOPED ADVERSE EVENTS
                        </CardHeader>
                        <CardBody className="trends-body">
                            <div className="col-12">
                                <HighchartsReact highcharts={Highcharts} options={under15AdverseEventsDesegregation} />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="col-6">
                    <Card className="trends-card">
                        <CardHeader className="trends-header">
                            ADULTS 15+ ON ART AND DEVELOPED ADVERSE EVENTS (N={totalAdultsAdverseEvents.total})
                        </CardHeader>
                        <CardBody className="trends-body">
                            <div className="col-12">
                                <HighchartsReact highcharts={Highcharts} options={adults15PlusAdverseEventsDesegregation} />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </span>
    );
};

export default AdverseEventsTiles;
