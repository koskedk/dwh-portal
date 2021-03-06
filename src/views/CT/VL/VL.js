import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import VisibilitySensor from 'react-visibility-sensor';
import UniversalFilter from './../../Shared/UniversalFilter';
import SectionHeader from '../../Shared/SectionHeader';
import SectionFooter from '../../Shared/SectionFooter';
import VLOverview from './VLOverview';
import VLOverallUptakeAndSuppression from './VLOverallUptakeAndSuppression';
import MedianTimeTo1stVL from './MedianTimeTo1stVL';
import MedianTimeTo1stVLByCounty from './MedianTimeTo1stVLByCounty';
import MedianTimeTo1stVLByPartner from './MedianTimeTo1stVLByPartner';
import VLUptakeBySex from './VLUptakeBySex';
import VLUptakeByAge from './VLUptakeByAge';
import VLUptakeByCounty from './VLUptakeByCounty';
import VLUptakeByPartner from './VLUptakeByPartner';
import VLOutcomesOverall from './VLOutcomesOverall';
import VLOutcomesBySex from './VLOutcomesBySex';
import VLSuppressionByAge from './VLSuppressionByAge';
import VLSuppressionByRegimen from './VLSuppressionByRegimen';
import VLSuppressionByYear from './VLSuppressionByYear';
import VLSuppressionByCounty from './VLSuppressionByCounty';
import VLSuppressionByPartner from './VLSuppressionByPartner';
import VLSuppressionByYear6Month from './VLSuppressionByYear6Month';
import VLSuppressionByYear12Month from './VLSuppressionByYear12Month';
import VLSuppressionByYear24Month from './VLSuppressionByYear24Month';
import VLOverallUptakeAndSuppressionByFacility from './VLOverallUptakeAndSuppressionByFacility';
import { enableStickyFilter, disableStickyFilter } from "../../../actions/Shared/uiActions";

const VL = () => {
    const branding = { title: "VIRAL LOAD MONITORING", description: "OVERVIEW", overview: "Viral Load Monitoring" };
    const ctTab = useSelector(state => state.ui.ctTab);
    const dispatch = useDispatch();
    const onVisibilityChange = (isVisible) => {
        if (ctTab === 'vl') {
            if (isVisible) {
                dispatch(disableStickyFilter());
            } else {
                dispatch(enableStickyFilter());
            }
        }
    };
    return (
        <div className="animated fadeIn">
            <SectionHeader title={branding.title}/>
            <VisibilitySensor onChange={onVisibilityChange}>
                <UniversalFilter/>
            </VisibilitySensor>
            <VLOverview />
            <Row>
                <Col>
                    <VLOverallUptakeAndSuppression />
                </Col>
                <Col>
                    <MedianTimeTo1stVL />
                </Col>
            </Row>
            <SectionFooter overview={branding.overview}/>
            <MedianTimeTo1stVLByCounty />
            <SectionFooter overview={branding.overview}/>
            <MedianTimeTo1stVLByPartner />
            <SectionFooter overview={branding.overview}/>
            <Row>
                <Col sm={4}>
                    <VLUptakeBySex />
                </Col>
                <Col sm={8}>
                    <VLUptakeByAge />
                </Col>
            </Row>
            <SectionFooter overview={branding.overview}/>
            <VLUptakeByCounty />
            <SectionFooter overview={branding.overview}/>
            <VLUptakeByPartner />
            <SectionFooter overview={branding.overview}/>
            <Row>
                <Col sm={4}>
                    <VLOutcomesOverall />
                </Col>
                <Col sm={8}>
                    <VLOutcomesBySex />
                </Col>
            </Row>
            <SectionFooter overview={branding.overview}/>
            <VLSuppressionByAge />
            <SectionFooter overview={branding.overview}/>
            <Row>
                <Col sm={4}>
                    <VLSuppressionByRegimen />
                </Col>
                <Col sm={8}>
                    <VLSuppressionByYear />
                </Col>
            </Row>
            <SectionFooter overview={branding.overview}/>
            <VLSuppressionByCounty />
            <SectionFooter overview={branding.overview}/>
            <VLSuppressionByPartner />
            <SectionFooter overview={branding.overview}/>
            <VLSuppressionByYear6Month />
            <SectionFooter overview={branding.overview}/>
            <VLSuppressionByYear12Month />
            <SectionFooter overview={branding.overview}/>
            <VLSuppressionByYear24Month />
            <SectionFooter overview={branding.overview}/>
            <VLOverallUptakeAndSuppressionByFacility />
            <SectionFooter overview={branding.overview}/>
        </div>
    );

};

export default VL;
