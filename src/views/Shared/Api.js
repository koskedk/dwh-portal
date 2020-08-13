import axios from 'axios';
import moment from 'moment'
let url = null;

if(process.env.NODE_ENV.trim() === 'production') {
    url = 'https://data.kenyahmis.org:8082/api/';
} else {
    url = 'http://localhost:7000/api/';
}

export const getAll = async (endpoint, params) => {
    let request = axios.get(`${url}${endpoint}`);
    if (params) {
        request = axios.get(`${url}${endpoint}`,{ params: params });
    }
    try {
        const response = await request;
        const result = response.data;
        return result;
    } catch (e) {
        console.error(e);
    }
    return [];
};

export const getYearMonths = (minYear) => {
    const yearMonths = [];
    const startDate = moment([minYear]);
    const endDate = moment();

    if (endDate.isAfter(startDate)) {
        while (endDate.isAfter(startDate)) {
            // yearMonths.push({ value: endDate.year() + "," + endDate.month(), display: endDate.format("MMMM, YYYY")});
            yearMonths.push({ value: endDate.format('YYYY,M'), display: endDate.format("MMMM, YYYY")});
            endDate.subtract(1, 'month');
        }
    }

    return yearMonths;
};

export const getYears = (minYear) => {
    const years = [];
    const startDate = moment([minYear]);
    const endDate = moment();

    if (endDate.isAfter(startDate)) {
        while (endDate.isAfter(startDate)) {
            years.push({ value: endDate.format('YYYY'), display: endDate.format("YYYY")});
            endDate.subtract(1, 'year');
        }
    }

    return years;
};

export const getMonths = () => {
    return  {
        1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
        7: "July", 8:"August", 9: "September", 10: "October", 11: "November", 12: "December"
    };
};
