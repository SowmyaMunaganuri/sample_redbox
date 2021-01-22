const baseUrl = process.env.NODE_ENV === 'development' ? false : 'http://localhost:8080/playground';

/**
 * Object responsible for wells endpoints.
 */
const wells = {
    get_wells_list() {
        return 'wells_list';
    },
    update_wells() {
        return 'wells_update';
    },
};

/**
 * Object responsible for drillings endpoints.
 */
const drillings = {
    get_drillings_list() {
        return 'drilling_default';
    },
};

/**
 * Object responsible for completion endpoints.
 */
const completion = {
    get_calculate_drilling_schedule() {
        return 'calculate_drilling_schedule';
    },
    get_calculate_production_waterout() {
        return 'calculate_production_waterout';
    },
    get_calculate_financial() {
        return 'calculate_financial';
    },
};

const api = {
    wells,
    drillings,
    completion
};

export const options = {
    root: baseUrl,
    url: 'http://10.0.10.162:8080/playground',
    url2: 'http://10.0.10.162:5000/playground',
    url3: 'http://10.0.10.162:5002/playground',
    //url: 'http://192.168.1.80:8080/playground',
    //url2: 'http://192.168.1.80:5000/playground',
    // url: 'http://localhost:8080/playground',
    // url2: 'http://localhost:5000/playground',
};

export default api;
