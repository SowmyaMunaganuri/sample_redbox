import React, {Component, PureComponent,Fragment} from 'react';
import {getCompletionDataSync, getCompAreaInfo, getCrewMove, getCachedCrews} from './Utils';
import {parse, format, differenceInCalendarDays, addDays, subDays, startOfToday, isBefore, isAfter} from 'date-fns'
import '../App.css';
import {Redirect} from "react-router-dom"
let colors = require('./colors.json')
const scale = 8;
const today = startOfToday();


let s2s = {};
let agg = {'1': 0, '1_5': 0, '1_75': 0, '2': 0, '2_25': 0, '2_5': 0, '3': 0};
let padMove = {};

function getS2R(split) {
    let max = 0;
    split.wells.forEach(well => {
        if (parseFloat(well.Length) > max)
            max = parseFloat(well.Length);
    });

    let numWells = split.wells.length;
    let res;
    if (numWells < 9) {
        res = s2s[numWells][max.toString().replace('.', '_')];
    } else {
        res = s2s[8][max.toString().replace('.', '_')] + (numWells - 8) * 7;
    }
    return res;
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

    reCalc = (splits, rigStart) => {
        for (let i = 0; i < splits.length; i++) {
            let split = {...splits[i]};
            let start = i === 0 ? rigStart : splits[i - 1].end;
            split.start = differenceInCalendarDays(split.Ready2Frac, start) > 0 ? split.Ready2Frac : start;

            split.release = addDays(split.start, split.duration);

            split.end = addDays(split.release,
                (i < splits.length - 1 && split.SplitDrillTank === splits[i + 1].SplitDrillTank)
                    ? padMove.same : padMove.different);

            split.wells.forEach(well => {
                well.FracDate = split.start;
                well.CrewReleaseDate = split.release;
                well.FracDateEnd = split.end;
            });
            splits[i] = split;
        }
    }

    initSplit = (well) => {
        return {
            SplitFracTank: well.SplitFracTank,
            SplitDrillTank: well.SplitDrillTank,
            DrillTank: well.DrillTank,
            Ready2Frac: well.Ready2Frac,
            start: well.FracDate,
            release: well.CrewReleaseDate,
            end: well.FracDateEnd,
            Project: well.Project,
            duration: differenceInCalendarDays(well.CrewReleaseDate, well.FracDate),
            wells: [well]
        };
    }

    componentDidMount() {
        console.log("Comp did mount!!!!!")

        let areaInfo = JSON.parse(getCompAreaInfo());
        let padinfo = JSON.parse(getCrewMove());

        padinfo.forEach(e => {
            padMove[e.pad_type] = e.interval;
        });
        console.log('padmovetimes', padMove);

        areaInfo.forEach(e => {
            s2s[e.num_of_wells] = e;
        });
        console.log('s2s', s2s);

        ///////////////////////////////////////////////
        let input = JSON.parse(getCompletionDataSync());

        console.log(input);

        let cachedRigsArr = JSON.parse(getCachedCrews());

        let cantBeFracScheduled = [];
        let rigsOfWells = {};
        let bullOfWells = [];
        let nearBullOfWells = [];
        let batchStash = [];

        input.forEach((well, wellI) => {
            if (well.CanBeFracScheduled) {
                well.FracDate = parse(well.FracDate, 'MM/dd/yyyy', new Date());
                well.FracDateEnd = parse(well.FracDateEnd, 'MM/dd/yyyy', new Date());
                well.Ready2Frac = parse(well.Ready2Frac, 'MM/dd/yyyy', new Date());
                if (well.CrewReleaseDate) {
                    well.CrewReleaseDate = parse(well.CrewReleaseDate, 'MM/dd/yyyy', new Date());////////////////
                } else {
                    console.log('no CrewReleaseDate; assign CrewReleaseDate = FracDateEnd - 1', well);
                    well.CrewReleaseDate = subDays(well.FracDateEnd, 1);////////////////////////////////////////////
                }

                if (well.BatchID.charAt(1) === '2') {////////////////////batches   
                    console.log('batch stash', well.DPWellName);
                    batchStash.push(well);
                    return;
                }////////////////////////////////////////////////batches

                if (well.UserFracScheduled) {
                    if (rigsOfWells.hasOwnProperty(well.CrewAssignment)) {
                        rigsOfWells[well.CrewAssignment].push(well);
                    } else {
                        rigsOfWells[well.CrewAssignment] = [well];
                    }
                } else {
                    if (well.NearTermFrac)
                        nearBullOfWells.push(well);
                    else
                        bullOfWells.push(well);
                }
            } else {
                cantBeFracScheduled.push(well);
            }
        });

        let rigsOfCurrents = {};
        let rigsOfNears = {};
        let rigsOfSplits = {};
        let rigsOfNearStarts = {};
        let topCurrent = today;

        for (let rig in rigsOfWells) {
            rigsOfWells[rig].sort((a, b) => a.FracDate - b.FracDate);

            rigsOfWells[rig].forEach(well => {

                if (well.NearTermFrac) {
                    if (differenceInCalendarDays(today, well.FracDate) >= 0) {        //currents

                        if (differenceInCalendarDays(topCurrent, well.FracDate) > 0) {//////////////////////////////
                            topCurrent = well.FracDate;
                            console.log('new topcurrent', well);
                        }

                        if (rigsOfCurrents.hasOwnProperty(rig)) {      //not first well in rig
                            let newSplit = true;

                            rigsOfCurrents[rig].forEach(split => {
                                if (split.SplitFracTank === well.SplitFracTank) {   //not first well in split
                                    split.wells.push(well);
                                    newSplit = false;
                                    return;
                                }
                            });
                            if (newSplit) {         //first well in split
                                rigsOfCurrents[rig].push(this.initSplit(well));
                            }
                        } else {    //first well in rig
                            rigsOfCurrents[rig] = [this.initSplit(well)];
                        }

                    } else {                                        //nears
                        if (rigsOfNears.hasOwnProperty(rig)) {      //not first well in rig
                            let newSplit = true;

                            rigsOfNears[rig].forEach(split => {
                                if (split.SplitFracTank === well.SplitFracTank) {   //not first well in split
                                    split.wells.push(well);
                                    newSplit = false;
                                    return;
                                }
                            });
                            if (newSplit) {         //first well in split
                                rigsOfNears[rig].push(this.initSplit(well));
                            }
                        } else {    //first well in rig
                            rigsOfNears[rig] = [this.initSplit(well)];
                            rigsOfNearStarts[rig] = well.FracDate;
                        }
                    }
                } else {                    //far term
                    if (rigsOfSplits.hasOwnProperty(rig)) {

                        let newSplit = true;

                        rigsOfSplits[rig].forEach(split => {
                            if (split.SplitFracTank === well.SplitFracTank) {
                                split.wells.push(well);
                                newSplit = false;
                                return;
                            }
                        });
                        if (newSplit) {         //first well in split
                            rigsOfSplits[rig].push(this.initSplit(well));
                        }

                    } else {         //first well in rig
                        rigsOfSplits[rig] = [this.initSplit(well)];
                    }
                }       //far term
            });     //each well
        }           //each rig

        let rigs = [];

        cachedRigsArr.forEach(e => {
            let rig = e.crew_id;

            let currents = rigsOfCurrents[rig] || [];

            // let nearStart = rigsOfNearStarts[rig] || today;
            let nearStart = rigsOfNearStarts[rig] || parse(e.available_date, 'MM/dd/yyyy', new Date());

            let nears = rigsOfNears[rig] || [];

            this.reCalc(nears, nearStart);

            let farStart = nears.length ? nears[nears.length - 1].end : nearStart;
            let splits = rigsOfSplits[rig] || [];

            splits.forEach((split, i) => {
                splits[i].duration = getS2R(split);
            });

            this.reCalc(splits, farStart);

            rigs.push({
                RigAssignment: rig,
                currents: currents,
                nearStart: nearStart,
                nears: nears,
                farStart: farStart,
                splits: splits,
            });

            delete rigsOfCurrents[rig];
            delete rigsOfNears[rig];
            delete rigsOfSplits[rig];
        });


        //wells that dont have a rigAssignment equal to one of the cached rigs go into bull
        for (let rig in rigsOfCurrents) {
            console.log('rigsofcurrents, no cached rig', rigsOfCurrents[rig]);
            rigsOfCurrents[rig].forEach(split => {
                nearBullOfWells = [...nearBullOfWells, ...split.wells];
            });
        }

        for (let rig in rigsOfNears) {
            console.log('rigsOfNears, no cached rig', rigsOfNears[rig]);
            rigsOfNears[rig].forEach(split => {
                nearBullOfWells = [...nearBullOfWells, ...split.wells];
            });
        }

        for (let rig in rigsOfSplits) {
            console.log('rigsOfSplits, no cached rig', rigsOfSplits[rig]);
            rigsOfSplits[rig].forEach(split => {
                bullOfWells = [...bullOfWells, ...split.wells];
            });
        }

        let nearBull = [];
        nearBullOfWells.forEach(well => {
            let newSplit = true;
            nearBull.forEach(split => {
                if (split.SplitFracTank === well.SplitFracTank) {
                    newSplit = false;
                    split.wells.push(well);
                    if (well.CanBeDrillScheduled && !well.UserDrillScheduled)
                        split.disabled = true;
                }
            });
            if (newSplit) {
                nearBull.push({
                    SplitFracTank: well.SplitFracTank,
                    SplitDrillTank: well.SplitDrillTank,
                    DrillTank: well.DrillTank,
                    Ready2Frac: well.Ready2Frac,
                    Project: well.Project,
                    duration: differenceInCalendarDays(well.CrewReleaseDate, well.FracDate),
                    wells: [well],
                    disabled: well.CanBeDrillScheduled === 1 && well.UserDrillScheduled === 0
                });
            }
        });
        nearBull.forEach(split => {
            split.duration = getS2R(split);
        });

        let bull = [];
        bullOfWells.forEach(well => {
            let newSplit = true;
            bull.forEach(split => {
                if (split.SplitFracTank === well.SplitFracTank) {
                    newSplit = false;
                    split.wells.push(well);
                    if (well.CanBeDrillScheduled && !well.UserDrillScheduled)
                        split.disabled = true;
                }
            });
            if (newSplit) {
                bull.push({
                    SplitFracTank: well.SplitFracTank,
                    SplitDrillTank: well.SplitDrillTank,
                    DrillTank: well.DrillTank,
                    Ready2Frac: well.Ready2Frac,
                    Project: well.Project,
                    wells: [well],
                    disabled: well.CanBeDrillScheduled === 1 && well.UserDrillScheduled === 0
                });
            }
        });
        bull.forEach(split => {
            split.duration = getS2R(split);
        });

        this.setState({
            rigs: [...rigs],
            bull: [...bull],
            nearBull: [...nearBull],
            cantBeFracScheduled: cantBeFracScheduled,
            batchStash: batchStash,
            topCurrent: topCurrent
        });

    }

    render() {
        return (
            <Fragment>
        {this.props.isUser === "true" ? (
          <Redirect to="/app/completion" />
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
                {props.rig.currents.map((split, i) =>
                    <Current split={split} key={i} index={i} rigIndex={props.index} topCurrent={props.topCurrent} />
                )}

                <div style={{
                    borderTop: '.5px dashed grey', zIndex: 8, position: 'absolute', width: 200, top: differenceInCalendarDays(today, props.topCurrent) * scale
                }}></div>
            </div>

            <div style={{height: topDiff >= 0 ? topDiff * scale : 0}}></div>

            <div style={{top: topDiff >= 0 ? 0 : topDiff * scale}}>
                {props.rig.nears.map((split, i, arr) =>
                    <Tank
                        split={split}
                        prev0={i === 0 ? subDays(props.rig.nearStart, 1) : arr[i - 1].release}
                        index={i}
                        key={i}
                        rigIndex={props.index}
                        near={1}
                        bull={0}
                    />
                )}
            </div>

            <div className='tankListDiv' style={{top: topDiff >= 0 ? 0 : topDiff * scale}}>
                {props.rig.splits.map((split, i, arr) =>
                    <Tank
                        split={split}
                        prev0={i === 0 ? props.rig.nears.length ? addDays(props.rig.nears[props.rig.nears.length - 1].release, 1) : props.rig.farStart : arr[i - 1].end}
                        index={i}
                        key={i}
                        rigIndex={props.index}
                        near={0}
                        bull={0}
                    />
                )}
            </div>

        </div>
    )
}

class Tank extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        }
    }

    render() {
        const {split, prev0, index, rigIndex, near, bull} = this.props;
        let prev;
        if (prev0)
            prev = near ? addDays(prev0, 1) : prev0;    //purecomponent issue

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
                    fontWeight: near ? 'normal' : 'bold',
                    height: bull ? 'auto' : near ?
                        (differenceInCalendarDays(split.release, split.start) + 1) * scale
                        : differenceInCalendarDays(split.end, split.start) * scale,
                    marginTop: prev0 ? differenceInCalendarDays(split.start, prev) * scale : 0,   //<= bull
                }}
            >
                <div className='nearWellDiv2'>
                    <div style={{flex: 1}}>
                        {differenceInCalendarDays(split.release, split.start) + 1}
                    </div>

                    <div style={{flex: 3}}>
                        <div style={{fontSize: 11}}>{bull ? '' : format(split.start, 'MM/dd/yyyy')}</div>
                        <div>
                            {
                                // this.state.hover ?
                                //     <div style={{fontSize: 15}}>{split.SplitFracTank}</div>
                                //     :
                                    split.wells.map((e, i) =>
                                        <div key={i}>{e.DPWellName}</div>
                                    )

                            }
                        </div>
                        <div>{format(split.release, 'MM/dd/yyyy') }</div>
                    </div>

                    <div style={{flex: 1}}>
                        {differenceInCalendarDays(split.start, split.Ready2Frac)}
                    </div>
                </div>
            </div>
        )
    }
}

function Current(props) {

    return (
        <div
            className='currentDiv'
            style={{
                top: differenceInCalendarDays(props.split.start, props.topCurrent) * scale,
                height: (props.split.duration + 1) * scale,
            }}
        >
            {
                <div
                    className='nearWellDiv2'
                    style={{flexDirection: 'column'}}
                >
                    <span>{format(props.split.start, 'MM/dd/yyyy')}</span>
                    {props.split.wells.map((e, i) =>
                        <span key={i}>{e.DPWellName}</span>
                    )}
                    <span>{format(props.split.release, 'MM/dd/yyyy')}</span>

                </div>
            }
        </div>
    )
}
