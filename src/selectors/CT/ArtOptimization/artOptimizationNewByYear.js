import _ from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';

const listUnfiltered = state => state.artOptimizationNewByYear.listUnfiltered;
const listFiltered = state => state.artOptimizationNewByYear.listFiltered;

const counties = state => state.filters.counties;
const subCounties = state => state.filters.subCounties;
const facilities = state => state.filters.facilities;
const partners = state => state.filters.partners;
const agencies = state => state.filters.agencies;
const projects = state => state.filters.projects;
const fromDate = state => state.filters.fromDate;
const toDate = state => state.filters.toDate;

export const getNewByYear = createSelector(
    [listUnfiltered, listFiltered, counties, subCounties, facilities, partners, agencies, projects],
    (listUnfiltered, listFiltered, counties, subCounties, facilities, partners, agencies, projects) => {
        const filtered = (counties.length || subCounties.length || facilities.length || partners.length || agencies.length || projects.length) ? true : false;
        const list = filtered ? listFiltered : listUnfiltered;
        return _.chain(list).map(l => {
            if (l.startRegimen !== "TLE" && l.startRegimen !== "TLD" && l.startRegimen !== "Other Regimen") {
                return {
                    ...l,
                    startRegimen: "OTHERS"
                }
            } else {
                return l;
            }
        }).value();
    }
);

export const getMonthYear = createSelector(
    [fromDate, toDate], (fromDate, toDate) => {
        let to = toDate ? moment(toDate, 'MMM YYYY') : moment().startOf('month');
        let from = fromDate ? moment(fromDate, 'MMM YYYY') : to.clone().startOf('year');
        let diff = from.diff(to, 'month');
        if (diff <= 0) {
            from = to.clone().startOf('year');
        }
        const monthYear = [];
        while (to > from) {
            monthYear.push(from.format('MMMM YYYY'));
            from.add(1, 'month');
        }
        return monthYear;
    }
);

export const getRegimens = createSelector(
    [listUnfiltered, listFiltered, counties, subCounties, facilities, partners, agencies, projects],
    (listUnfiltered, listFiltered, counties, subCounties, facilities, partners, agencies, projects) => {
        const filtered = (counties.length || subCounties.length || facilities.length || partners.length || agencies.length || projects.length) ? true : false;
        const list = filtered ? listFiltered : listUnfiltered;
        return _.chain(list).filter(l => l.startRegimen && (l.startRegimen === "TLD" || l.startRegimen === "TLE" || l.startRegimen === "Other Regimen")).map(l => l.startRegimen).uniq().sort().value();
    }
);