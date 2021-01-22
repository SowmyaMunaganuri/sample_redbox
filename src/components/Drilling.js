import React, {Component, PureComponent, Fragment} from 'react';
import {getDrillsDataSync, getDrillingAreaInfo, getPadMove, getCachedRigs} from './Utils';
import {parse, format, differenceInCalendarDays, addDays, subDays, startOfToday, isBefore, isAfter} from 'date-fns'
import '../App.css';
import {Redirect} from "react-router-dom"
let colors = require('./colors.json')
const scale = 4;
const today = startOfToday();


let s2s = {};
let agg = {'1': 0, '1_5': 0, '1_75': 0, '2': 0, '2_25': 0, '2_5': 0, '3': 0};
let padMove = {};
function getS2R(well) {
    if (!well.Length) {
        console.log('well doesnt have length!!!!!!!!', well);
        return 10;
    }

    if (s2s.hasOwnProperty(well.DrillPlanArea))
        return s2s[well.DrillPlanArea][well.Length.replace('.', '_')]
    else {
        if (well.DrillPlanArea)
            console.log('BAD DRILLPLANAREA!!!!!!!!!', well);
        return s2s.avg[well.Length.replace('.', '_')];
    }
}

export default class Drilling extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rigs: [],
            nearBull: [],
            bull: [],
            topCurrent: today
        }
    }
    reCalcFar = (splits, rigStart) => {
        for (let s = 0; s < splits.length; s++) {
            let split = {...splits[s]};
            let wells = [...split.wells];

            split.start = s === 0 ? rigStart : splits[s - 1].end;

            for (let i = 0; i < wells.length; i++) {
                let well = {...wells[i]};

                well.SpudDate = i === 0 ? split.start : wells[i - 1].SpudDateEnd;
                well.RigReleaseDate = addDays(well.SpudDate, well.s2r);
                well.SpudDateEnd = addDays(well.RigReleaseDate,
                    i === wells.length - 1 ? padMove.different : padMove.same);

                wells[i] = well;
            }
            split.end = wells[wells.length - 1].SpudDateEnd;
            split.wells = wells;
            splits[s] = split;
        }
    }

    reCalcNear = (nears, nearStart) => {
        for (let i = 0; i < nears.length - 1; i++) {
            let near = {...nears[i]};
            near.SpudDate = i === 0 ? nearStart : nears[i - 1].SpudDateEnd;
            near.RigReleaseDate = addDays(near.SpudDate, near.s2r);
            near.SpudDateEnd = addDays(near.RigReleaseDate,
                near.SplitDrillTank === nears[i + 1].SplitDrillTank ? padMove.same : padMove.different);
            nears[i] = near;
        }

        if (nears.length > 0) {     //last near gets padmove:different
            let nearL = {...nears[nears.length - 1]};
            nearL.SpudDate = nears.length === 1 ? nearStart : nears[nears.length - 2].SpudDateEnd;
            nearL.RigReleaseDate = addDays(nearL.SpudDate, nearL.s2r);
            nearL.SpudDateEnd = addDays(nearL.RigReleaseDate, padMove.different);
            nears[nears.length - 1] = nearL;
        }
    }


    componentDidMount() {
        console.log("Drilling did mount!!!!!")


        let areaInfo = JSON.parse(getDrillingAreaInfo());
        let padinfo = JSON.parse(getPadMove());
        // console.log('padinfo', padinfo);
        padinfo.forEach(e => {
            padMove[e.pad_type] = e.interval;
        });
        console.log('padmovetimes', padMove);

        areaInfo.forEach(e => {
            s2s[e.Area] = e;
            for (let len in agg) {
                agg[len] += e[len];
            }
        });
        for (let len in agg) {
            agg[len] = Math.round(agg[len] / areaInfo.length);
        }
        s2s.avg = agg;

        console.log('s2s', s2s);

        ///////////////////////////////////////////////

        let input = JSON.parse(getDrillsDataSync());
        console.log(input);

        let cachedRigsArr = JSON.parse(getCachedRigs());

        let rigsOfWells = {};
        let cantBeDrillScheduled = [];
        let bullOfWells = [];
        let nearBull = [];

        input.forEach((well, wellI) => {
            if (well.CanBeDrillScheduled) {

                well.SpudDate = parse(well.SpudDate, 'MM/dd/yyyy', new Date());
                well.SpudDateEnd = parse(well.SpudDateEnd, 'MM/dd/yyyy', new Date());
                well.RigReleaseDate = parse(well.RigReleaseDate, 'MM/dd/yyyy', new Date());

                if (well.UserDrillScheduled) {
                    if (well.NearTermDrill)
                        well.s2r = differenceInCalendarDays(well.RigReleaseDate, well.SpudDate);
                    else
                        well.s2r = getS2R(well);

                    if (rigsOfWells.hasOwnProperty(well.RigAssignment)) {
                        rigsOfWells[well.RigAssignment].push({...well});
                    } else {
                        rigsOfWells[well.RigAssignment] = [{...well}];
                    }
                } else {            ////////bull
                    well.s2r = getS2R(well);

                    if (well.NearTermDrill) {
                        nearBull.push({...well});
                    } else {
                        bullOfWells.push({...well});
                    }
                }
            } else {
                cantBeDrillScheduled.push({...well});
            }
        });

        let rigsOfCurrents = {};
        let rigsOfNears = {};
        let rigsOfSplits = {};
        let rigsOfNearStarts = {};
        let topCurrent = today;

        for (let rig in rigsOfWells) {
            rigsOfWells[rig].sort((a, b) => a.SpudDate - b.SpudDate);/////////////////need??

            rigsOfWells[rig].forEach(well => {

                if (well.NearTermDrill) {

                    if (differenceInCalendarDays(today, well.SpudDate) >= 0) {        //currently drilling or drilled

                        if (differenceInCalendarDays(topCurrent, well.SpudDate) > 0) {//////////////////////////////
                            topCurrent = well.SpudDate;
                        }

                        if (rigsOfCurrents.hasOwnProperty(rig))
                            rigsOfCurrents[rig].push(well);
                        else
                            rigsOfCurrents[rig] = [well];

                    } else {                                        //nears///////////
                        if (rigsOfNears.hasOwnProperty(rig)) {
                            rigsOfNears[rig].push(well);
                        } else {
                            rigsOfNears[rig] = [well];
                            rigsOfNearStarts[rig] = well.SpudDate;
                        }
                    }
                } else {    //far term
                    if (rigsOfSplits.hasOwnProperty(rig)) {

                        let newSplit = true;

                        rigsOfSplits[rig].forEach(split => {
                            if (split.SplitDrillTank === well.SplitDrillTank) {
                                split.wells.push(well);
                                newSplit = false;
                                return;
                            }
                        });

                        if (newSplit) {     //first well in split
                            rigsOfSplits[rig].push({
                                SplitDrillTank: well.SplitDrillTank,
                                DrillTank: well.DrillTank,
                                Project: well.Project,
                                // s2s: getS2R(well),
                                wells: [well],
                                // start: well.SpudDate,
                            });
                        }

                    } else {        //first well in rig
                        rigsOfSplits[rig] = [{
                            SplitDrillTank: well.SplitDrillTank,
                            DrillTank: well.DrillTank,
                            Project: well.Project,
                            // s2s: getS2R(well),
                            wells: [well],
                            // start: well.SpudDate,
                        }];
                    }
                }       //far term
            });     //each well
        }       //each rig

        let rigs = [];

        cachedRigsArr.forEach(e => {
            let rig = e.Rig;

            let currents = rigsOfCurrents[rig] || [];
            let nearStart = rigsOfNearStarts[rig] || parse(e.Date, 'MM/dd/yyyy', new Date());
            let nears = rigsOfNears[rig] || [];
            let splits = rigsOfSplits[rig] || [];

            this.reCalcNear(nears, nearStart);
            let farStart = nears.length ? nears[nears.length - 1].SpudDateEnd : nearStart;
            this.reCalcFar(splits, farStart);

            rigs.push({
                RigAssignment: rig,
                nearStart: nearStart,
                farStart: farStart,
                splits: splits,
                nears: nears,
                currents: currents
            });

            delete rigsOfCurrents[rig];
            delete rigsOfNears[rig];
            delete rigsOfSplits[rig];
        });

        //wells that dont have a rigAssignment equal to one of the cached rigs go into bull
        for (let rig in rigsOfCurrents) {
            console.log('rigsofcurrents, no cached rig', rigsOfCurrents[rig]);
            rigsOfCurrents[rig].forEach(well => {
                well.UserDrillScheduled = 0;
                well.s2r = getS2R(well);
                well.RigAssignment = '';
            });
            nearBull = [...nearBull, ...rigsOfCurrents[rig]];
        }

        for (let rig in rigsOfNears) {
            console.log('rigsOfNears, no cached rig', rigsOfNears[rig]);
            rigsOfNears[rig].forEach(well => {
                well.UserDrillScheduled = 0;
                well.s2r = getS2R(well);
                well.RigAssignment = '';
            });
            nearBull = [...nearBull, ...rigsOfNears[rig]];
        }

        for (let rig in rigsOfSplits) {
            console.log('rigsOfSplits, no cached rig', rigsOfSplits[rig]);
            rigsOfSplits[rig].forEach(split => {
                split.wells.forEach(well => {
                    well.UserDrillScheduled = 0;
                    well.s2r = getS2R(well);
                    well.RigAssignment = '';
                });
                bullOfWells = [...bullOfWells, ...split.wells];
            });
        }

        let bull = [];

        bullOfWells.forEach(well => {
            let newSplit = true;
            bull.forEach(split => {
                if (split.SplitDrillTank === well.SplitDrillTank) {
                    newSplit = false;
                    split.wells.push(well);
                }
            });
            if (newSplit) {
                bull.push({
                    SplitDrillTank: well.SplitDrillTank,
                    DrillTank: well.DrillTank,
                    Project: well.Project,
                    // s2s: getS2R(well),
                    // start: well.SpudDate,
                    wells: [well]
                });
            }
        });

        this.setState({
            // rigs: calcDates(rigs),
            rigs: [...rigs],
            bull: [...bull],
            nearBull: [...nearBull],
            cantBeDrillScheduled: cantBeDrillScheduled,
            topCurrent: topCurrent,
            s2s: s2s
        });
    }

    render() {
        console.log("Drilling render")
        return (
            <Fragment>
        {this.props.isUser === "true" ? (
          <Redirect to="/app/drilling" />
        ) : (
          (window.location.href = "/")
        )}
            <div style={{padding: '5px', display: 'flex', justifyContent: 'space-between'}}>
                <div className='rigsDiv'>
                    {this.state.rigs.map((rig, i) =>
                        <Rig rig={rig} index={i} key={format(rig.nearStart, 'yyyy-MM-dd') + i} topCurrent={this.state.topCurrent} />
                    )}
                </div>
            </div>
            </Fragment>
        )
    }
}

function Rig(props) {
    console.log(props);
    let topDiff = differenceInCalendarDays(props.rig.nearStart, props.topCurrent);

    return (
        <div className='rigDiv'>
            <div className='rigName'>
                {props.rig.RigAssignment}
            </div>

            <div style={{position: 'relative'}}>
                {props.rig.currents.map((well, i) =>
                    <Current well={well} key={i} index={i} rigIndex={props.index} topCurrent={props.topCurrent} />
                )}

                <div style={{
                    borderTop: '.5px dashed grey', zIndex: 8, position: 'absolute', width: 200, top: differenceInCalendarDays(today, props.topCurrent) * scale
                }}></div>
            </div>

            <div style={{height: topDiff >= 0 ? topDiff * scale : 0}}></div>

            <div className='nearWellListDiv' style={{top: topDiff >= 0 ? 0 : topDiff * scale}}>
                {props.rig.nears.map((well, i) =>
                    <NearWell well={well} index={i} rigIndex={props.index} key={i} />
                )}
            </div>

            <div className='tankListDiv' style={{top: topDiff >= 0 ? 0 : topDiff * scale}}>
                {props.rig.splits.map((split, i) =>
                    <Tank split={split} rigIndex={props.index} index={i} key={i} />
                )}
            </div>

        </div>
    )
}

class Tank extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }
    }

    render() {
        const {split, bull} = this.props;

        let proj = split.Project;
        let r, g, b, a, d;
        if (colors.hasOwnProperty(proj)) {
            r = colors[proj][0];
            g = colors[proj][1];
            b = colors[proj][2];
            a = colors[proj][3];
            d = colors[proj][4];
        } else {
            r = 255; g = 255; b = 255; a = 1; d = 0;
        }

        return (
            <div
                className='tankDiv'
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                style={{
                    backgroundColor: `rgb(${r},${g},${b},${a})`,
                    color: d ? "Gainsboro" : "black",
                    height: bull ? 'auto' : differenceInCalendarDays(split.end, split.start) * scale,
                }}
            >
                {
                // !this.state.hover ?
                    <div>
                        {split.wells.map((e, i) =>
                            <div key={i} style={{display: 'flex'}}>
                  
                                    <div>{format(e.SpudDate, 'MM/dd/yyyy')}</div>
                                
                                <div style={{paddingLeft: '10px', textAlign: 'left'}}>{e.DPWellName}</div>
                            </div>
                        )}
                    </div>
                    // :
                    // <div style={{fontSize: 14}}>
                    //     {split.SplitDrillTank}
                    //     <br />
                    //     {split.start instanceof Date && !isNaN(split.start) && !bull ?
                    //         format(split.start, 'MM/dd/yyyy')
                    //         : null
                    //     }
                    // </div>
                }
            </div>
        )
    }
}

class NearWell extends PureComponent {
    constructor(props) {
        super(props);
        // this.state = {
        //     hover: false,
        // }
    }

    render() {
        const {well, index, rigIndex, bull} = this.props;

        let proj = well.Project;
        let r, g, b, a, d;
        if (colors.hasOwnProperty(proj)) {
            r = colors[proj][0];
            g = colors[proj][1];
            b = colors[proj][2];
            a = colors[proj][3];
            d = colors[proj][4];
        } else {
            r = 255; g = 255; b = 255; a = 1; d = 0;
        }

        return (
            <div
                className='nearWellDiv'
                style={{
                    color: d ? "Gainsboro" : "black",
                    backgroundColor: `rgb(${r},${g},${b},${a})`,
                    height: (well.s2r + 1) * scale,
                    marginBottom: this.props.bull ? 0 : (differenceInCalendarDays(well.SpudDateEnd, well.RigReleaseDate) - 1) * scale,
                }}
            >
                {
                    (well.BatchID.charAt(1) === '1' || well.BatchID.charAt(1) === '2') ?
                        <div className='nearWellDiv2'>
                            <p style={{flex: 1, textAlign: 'left'}}>{well.BatchID.charAt(1) === '1' ? 'V' : 'H'}</p>
                            <div style={{flex: 10}}>
                                {format(well.SpudDate, 'MM/dd/yyyy')}<br />
                                {well.DPWellName}<br />
                                {format(well.RigReleaseDate, 'MM/dd/yyyy')}
                            </div>
                            <p style={{flex: 1}}></p>
                        </div>
                        :
                        <div className='nearWellDiv2'>
                            {format(well.SpudDate, 'MM/dd/yyyy')}<br />
                            {well.DPWellName}<br />
                            {format(well.RigReleaseDate, 'MM/dd/yyyy')}
                        </div>
                }

            </div>
        )
    }
}

function Current(props) {

    return (
        <div
            className='currentDiv'
            style={{
                top: differenceInCalendarDays(props.well.SpudDate, props.topCurrent) * scale,
                height: (props.well.s2r + 1) * scale,
            }}
        >
            {
                props.well.BatchID.charAt(1) === '1' ?
                    <div className='nearWellDiv2'>
                        {format(props.well.SpudDate, 'MM/dd/yyyy')}<br />
                        <p style={{position: 'absolute', left: 1}}>V</p>{props.well.DPWellName}<br />
                        {format(props.well.RigReleaseDate, 'MM/dd/yyyy')}</div>
                    :
                    props.well.BatchID.charAt(1) === '2' ?
                        <div className='nearWellDiv2'>
                            {format(props.well.SpudDate, 'MM/dd/yyyy')}<br />
                            <p style={{position: 'absolute', left: 1}}>H</p>{props.well.DPWellName}<br />
                            {format(props.well.RigReleaseDate, 'MM/dd/yyyy')}</div>
                        :
                        <div className='nearWellDiv2'>
                            {format(props.well.SpudDate, 'MM/dd/yyyy')}<br />
                            {props.well.DPWellName}<br />
                            {format(props.well.RigReleaseDate, 'MM/dd/yyyy')} </div>
            }
        </div>
    )
}

