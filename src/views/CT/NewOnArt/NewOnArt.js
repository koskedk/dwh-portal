import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import UniversalFilter from './../../Shared/UniversalFilter';
import NewOnArtHeader from './NewOnArtHeader';
import NewOnArtFooter from './NewOnArtFooter';
import NewOnArtTrends from './NewOnArtTrends';
import NewOnArtByAgeSex from './NewOnArtByAgeSex';
import MedianTimeToArtStart from './MedianTimeToArtStart';
import MedianTimeToArtStartByCounty from './MedianTimeToArtStartByCounty';
import MedianTimeToArtStartByPartner from './MedianTimeToArtStartByPartner';
import TimeFromDiagnosisToStart from './TimeFromDiagnosisToStart';
import { enableStickyFilter, disableStickyFilter } from "../../../actions/Shared/uiActions";
import NewOnARTTiles from './NewOnARTTiles';

const NewOnArt = () => {
    const ctTab = useSelector(state => state.ui.ctTab);
    const dispatch = useDispatch();
    const onVisibilityChange = (isVisible) => {
        if (ctTab === 'txNew') {
            if (isVisible) {
                dispatch(disableStickyFilter());
            } else {
                dispatch(enableStickyFilter());
            }
        }
    };
    return (
        <div className="animated fadeIn">
            <div className="strip"></div>
            <NewOnArtHeader></NewOnArtHeader>
            <VisibilitySensor onChange={onVisibilityChange}>
                <UniversalFilter/>
            </VisibilitySensor>
            <p></p>
            <NewOnARTTiles />
            <p></p>
            <NewOnArtTrends />
            <hr/>
            <NewOnArtFooter/>
            <hr/>
            <div className="strip"></div>
            <p></p>
            <p></p>
            <div className="row">
                <div className="col-12">
                    <NewOnArtByAgeSex />
                </div>
            </div>
            <hr/><NewOnArtFooter/><hr/><div className="strip"></div><p></p>
            <p></p><MedianTimeToArtStart />
            <hr/><NewOnArtFooter/><hr/><div className="strip"></div><p></p>
            <p></p><MedianTimeToArtStartByCounty />
            <hr/><NewOnArtFooter/><hr/><div className="strip"></div><p></p>
            <p></p><MedianTimeToArtStartByPartner />
            <hr/><NewOnArtFooter/><hr/><div className="strip"></div><p></p>
            <p></p><TimeFromDiagnosisToStart />
            <hr/><NewOnArtFooter/><hr/><div className="strip"></div><p></p>
            {/* <p></p><FacilitiesNewOnArtList />
            <hr/><NewOnArtFooter/><hr/><div className="strip"></div><p></p> */}
        </div>
    );

};

export default NewOnArt;