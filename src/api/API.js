import ChartAdapter from "./adapter/ChartAdapter";
import DrillsAdapter from "./adapter/DrillsAdapter";
import FinancialAdapter from "./adapter/FinancialAdapter";
import FracAdapter from "./adapter/FracAdapter";
import PricingAdapter from "./adapter/PricingAdapter";
import ProductionPricingAdapter from "./adapter/ProductionPricingAdapter";
import WellAdapter from "./adapter/WellAdapter";
import { options } from "./endpoints";

/*
import { wells } from "./testdata/wells";
import { drills } from "./testdata/drills";
import { rigs } from "./testdata/rigs";
import { crews } from "./testdata/crews";
import { fracs } from "./testdata/fracs";
import { rigsCrews_schedule } from "./testdata/rigsCrewsDataTable";
import { production_schedule } from "./testdata/productionDataTable";
import { drilling_schedule } from "./testdata/drilling_schedule";
import { drilling_data } from "./testdata/DrillingData";
import { frac_data } from "./testdata/FracData";
import { duc_data } from "./testdata/DUCData";
import { cnp_data } from "./testdata/CNPData";
// import { fiveyear } from './testdata/fiveyear';

*/

import { pricing } from "./testdata/pricing";

/*
Comparison functions for sorting a container of dictionaries
 */
function compareByLastFracDate(a,
    b) {
        if (a["frac_date_last"] > b["frac_date_last"]) {
            return 1;
        } else {
            return -1;
        }
    }

function compareByCrew(a,
    b) {
    if (a["crewID"] > b["crewID"]) {
        return 1;
    } else {
        return -1;
    }
}

class API {

    //getWellsData() {
        // axios.get(`${options.root}/wells_list`)
        //     .then(res => {
        //       return WellAdapter.getData(res);
        //     }).catch(error => {
        //
        // });
        //if (!options.root) return WellAdapter.getData(wells);
    //}

    getWellsDataSync() {

        let wells = [];
        
        let xhr = new XMLHttpRequest();

        xhr.open('GET', `${options.url}/wells_list`, false);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        try {
            xhr.send();
            if (xhr.status !== 200) {
                //console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {

                var array = JSON.parse(xhr.response);
                //console.log('retrieved wells: '+xhr.response);

                //convert array to an ordered array
                for (var i = 0; i < array.length; i++) {
                    var well = {
                        WID: array[i]["WID"],
                        DPWellName: array[i]["DPWellName"],
                        WaterOutWellName: array[i]["WaterOutWellName"],
                        Bench: array[i]["Bench"],
                        Project: array[i]["Project"],
                        Length: array[i]["Length"],
                        Cat: array[i]["Cat"],
                        Area: array[i]["Area"],
                        ProposedLocation: array[i]["ProposedLocation"],
                        MarketingArea: array[i]["MarketingArea"],
                        DrillPlanArea: array[i]["DrillPlanArea"],
                        Route: array[i]["Route"],
                        TypeCurve: array[i]["TypeCurve"],
                        DrillTank: array[i]["DrillTank"],
                        SplitDrillTank: array[i]["SplitDrillTank"],
                        SplitFracTank: array[i]["SplitFracTank"],
                        ProductionTank: array[i]["ProductionTank"],
                        OilB: array[i]["OilB"],
                        OilDe: array[i]["OilDe"],
                        GasB: array[i]["GasB"],
                        GasDe: array[i]["GasDe"],
                        PeakOilIP: array[i]["PeakOilIP"],
                        PeakGasIP: array[i]["PeakGasIP"],
                        x1stOilIP: array[i]["x1stOilIP"],
                        x1stGasIP: array[i]["x1stGasIP"],
                        SpudDate: array[i]["SpudDate"],
                        FracDate: array[i]["FracDate"],
                        DOFP: array[i]["DOFP"],
                        DIGD: array[i]["DIGD"],
                        DIOD: array[i]["DIOD"],
                        RigAssignment: array[i]["RigAssignment"],
                        CrewAssignment: array[i]["CrewAssignment"],
                        UserDrillScheduled: array[i]["UserDrillScheduled"],
                        UserFracScheduled: array[i]["UserFracScheduled"],
                        CanBeDrillScheduled: array[i]["CanBeDrillScheduled"],
                        CanBeFracScheduled: array[i]["CanBeFracScheduled"]
                    };
                    wells.push(well);
                }
                //console.log('ordered wells: '+JSON.stringify(wells));
                console.log("========Succeeded wells_list===============");
            }
        } catch (err) {
            //console.log("json request failed");
        }

        return wells;

    }

    updateWells(newData) {

        var xhr = new XMLHttpRequest();

        xhr.open('POST', `${options.url}/wells_update`, false);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Content-type', 'application/json');

        //var querystring = newData;
        //console.log("querystring=  "+querystring);


        //console.log(newData);
        //console.log(`=========`);

        var welldata = newData;
        //remove the extra column tableData added by ui
        //const {tableData, ...filteredData} = newData;
        //newData.tableData = undefined;
        //newData= JSON.parse(JSON.stringify(newData));
        for (var i = 0; i < welldata.length; i++) {
            var obj = welldata[i];
            delete welldata[i].tableData;
        }

        //console.log(newData);

        //var params = {
        //"wellListJSONStr":JSON.stringify(newData),
        //}

        //console.log(JSON.stringify(welldata));

        try {
            xhr.send(JSON.stringify(welldata));
            if (xhr.status !== 200) {
                //console.log(`Error Code ${xhr.status}: ${xhr.statusText}`);
            } else {
                //console.log(JSON.parse(xhr.response));
                //console.log("========Succeeded wells_update===============");
            }
        } catch (err) {
            //console.log("json request failed");
        }

        //return JSON.parse(xhr.response);
    }

    //getDrillData() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //if (!options.root) return DrillsAdapter.getData(drills);
    //}

    //getRigsData() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //if (!options.root) return DrillsAdapter.getData(rigs);
    //}

    //getCrewsDataJSON() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //if (!options.root) return DrillsAdapter.getData(crews);

        //var crews = '';

        //const rigs = DrillsAdapter.getData(API.getRigsData());
        //if (localStorage.getItem('drilling_frac_schedule')!==''){
        //crews = parseCompletion(JSON.parse(localStorage.getItem('drilling_frac_schedule')));
        //}else{
        //get a static set
        //crews = DrillsAdapter.getData(crews);
        //console.log(JSON.stringify(rigs));
        //}
        //return crews;
    //}

    //getDrillDataTable() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //console.log(DrillsAdapter.getParsedDataSet(drilling_schedule))
        //if (!options.root) return DrillsAdapter.getParsedDataSet(drilling_schedule);
    //}

    //getDrillingDataTable() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //console.log(DrillsAdapter.getParsedDataSet(drilling_schedule))
        //if (!options.root) return DrillsAdapter.getParsedDataSet(drilling_data);

        //const sch = JSON.parse(localStorage.getItem('drilling_frac_schedule'));
        //var arr1 = JSON.parse(localStorage.getItem('drilling_frac_schedule'));
        //var arr1 = DrillsAdapter.getParsedDataSet(DrillingFracSchedule);
        //var arr2 = []; // create an empty array
        //Object.keys(arr1).forEach(function(key){
        //arr2.push({spud_date:arr1[key].spud_date,well_name:arr1[key].well_name}) // push in the array
        //});
        //console.log(arr2);

        //const data = Object.entries(sch).map(item => ({
        //spud_date: item.spud_date,
        //well_name: item.well_name
        //}));
        //return JSON.parse(arr2);
    //}

    //getFracDataTable() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //console.log(DrillsAdapter.getParsedDataSet(drilling_schedule))
        //if (!options.root) return DrillsAdapter.getParsedDataSet(frac_data);
    //}

    //getDUCDataTable() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //console.log(DrillsAdapter.getParsedDataSet(drilling_schedule))
        //if (!options.root) return DrillsAdapter.getParsedDataSet(duc_data);
    //}

    //getCNPDataTable() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //console.log(DrillsAdapter.getParsedDataSet(drilling_schedule))
        //if (!options.root) return DrillsAdapter.getParsedDataSet(cnp_data);
    //}

    //getFracData() {
        // axios.get(`${options.root}/drilling_default`)
        //     .then(res => {
        //         return DrillsAdapter.getData(res);
        //     });
        //if (!options.root) return FracAdapter.getData(fracs);
    //}

    //getCrewsData() {
        // axios.post(`${options.root}/drilling/CrewsData?`)
        //     .then(res => {
        //         return ChartAdapter.getData(res);
        //     });
        //if (!options.root) return ChartAdapter.getData(rigsCrews_schedule, rigsCrews_schedule);
    //}

    //getWaterOut() {
        // axios.post(`${options.root}/drilling/waterOut`)
        //     .then(res => {
        //         return ChartAdapter.getData(res);
        //     });
        //if (!options.root) return ChartAdapter.getData(production_schedule, production_schedule);
    //}

    //getProduction() {
        // axios.post(`${options.root}/drilling/production`)
        //     .then(res => {
        //         return ChartAdapter.getData(res);
        //     });
        //console.log(ChartAdapter.getData(production_schedule, production_schedule));
        //if (!options.root) return ChartAdapter.getData(production_schedule, production_schedule);
    //}

    getPricing() {
        return PricingAdapter.getData(pricing);
    }

    //getRevenue(data) {
        //return ProductionPricingAdapter.getRevenue(data);
    //}

    // getFinancial() {
    //     return FinancialAdapter.getData(financial);
    // }

    // getFiveYear() {
    //     return FinancialAdapter.getData(fiveyear);
    // }

}

export default new API();
