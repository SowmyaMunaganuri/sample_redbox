import React from 'react'
import '../App.css';
import './redboxtheme/redboxtheme.css'
import { Renderers } from './Renderers';
import {Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

export default class GridComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userdata:[],
            editField: undefined,
            changes: false,
            user:[],
            widarray:[],
            merged:[],
            sort: [
                { field: 'SpudDate', dir: 'asc' }
            ]
        };
        this.renderers = new Renderers(this.enterEdit, this.exitEdit, 'inEdit');
    }
 
    componentDidMount(){
        this.setState({
            merged:this.props.grid_data,
            user:this.props.grid_data,
            widarray:this.props.wid_array
        })
    }
    render() {
        return (
            <Grid
                sort={this.state.sort}
                style={{ height: "90vh"}}
                // data={orderBy(this.state.merged,this.state.sort)}
                data={this.state.merged}
                sortable={true}
                scrollable={true}
                resizable={true}
                onItemChange={this.itemChange}
                cellRender={this.renderers.cellRender}
                rowRender={this.renderers.rowRender}
                editField="inEdit"
            >
                <GridToolbar>
                    <button
                        title="Save Changes"
                        className="k-button"
                        onClick={this.saveChanges}
                        disabled={!this.state.changes}
                    >
                        Save Changes
                    </button>
                    <button
                        title="Cancel Changes"
                        className="k-button"
                        onClick={this.cancelChanges}
                        disabled={!this.state.changes}
                    >
                        Cancel Changes
                    </button>
                </GridToolbar>
                <Column field="WID" title="Well ID" width="70px" locked={true} editable={false}  />
                <Column field="DPWellName" title="Well Name" width="180px" locked={true} editable={false} />
                <Column field="SpudDate" title="Spud Date" width="85px" format="{0:d}" locked={true} editable={false} />
                <Column field="FracDate" format="{0:d}" title="Frac Date" width="100px" locked={true} editable={false}/>
                <Column field="RigAssignment" title="Drilling Rig" width="70px" editable={false}/>
                <Column field="SHLFNL" title="FNL" width="70px" editable={false}/>
                <Column field="SHLFSL" title="FSL" width="70px" editable={false}/>
                <Column field="SHLFWL" title="FWL"  width="70px" editable={false}/>
                <Column field="SHLFEL" title="FEL" width="70px" editable={false} />
                <Column field="SHLSec" title="Sec" width="50px" editable={false}/>
                <Column field="SHLBlk" title="Blk" width="50px" editable={false}/>
                <Column field="SHLTwnshp" title="Twnshp" width="70px" editable={false}/>
                <Column field="Bench" title="Bench" width="70px" editable={false}/>
                <Column field="WI" title="CR WI" width="70px" />
                <Column field="NRI" title="CR NRI" width="70px" />
                

                <Column field="lease_obligation_date" format="{0:d}" title="Lease Obligation Date" width="100px" />
                <Column field="AFE_send_date" format="{0:d}" title="AFE Send Date" width="100px" />
                <Column field="AFE_approval_received" format="{0:d}" title="AFE Approval Date" width="100px" />
                <Column field="pre_plat" format="{0:d}" title="Pre-Plat" width="100px"/>
                <Column field="date_staked" format="{0:d}" title="Date Staked" width="100px"  />
                <Column field="title_opinion_approval_date" format="{0:d}" title="Title Opinion Approval Date" width="100px"/>
                <Column field="psa_pooling_ratification_date" format="{0:d}" title="PSA/Pooling Ratification Date" width="100px" />
                <Column field="permit_approval_date" format="{0:d}" title="Permit Approval Date" width="100px"  editable={true} />
                <Column field="SWR_13_except"  title="SWR13 Except" width="100px"/>
                <Column field="location_build_date" format="{0:d}" title="Location Build Date" width="100px"/>
            {/* <Column field="FracDate" format="{0:d}" title="Frac Date" width="100px" editable={false}/> */}
                <Column field="AFE_Capital_MM"  title="AFE Capital ($MM)" width="100px" />
            </Grid>
        );
    }
    enterEdit = (dataItem, field) => {
        console.log(dataItem)
        const merged = this.state.merged.map(item => ({
                ...item,
                inEdit: item.WID === dataItem.WID ? field : undefined
            })
        );
        this.setState({
            merged:merged,
            editField: field
        });
        if(!this.state.widarray.includes(dataItem.WID)){
            this.state.widarray.push(dataItem.WID)
        }
        
    }
    exitEdit = () => {
        const merged = this.state.merged.map(item => (
            { ...item, inEdit: undefined }
        ));

        this.setState({
            merged:merged,
            editField: undefined,
        });
    }
    saveChanges = () => {
        this.setState({
            // user:this.state.data,
            merged:this.state.merged,
            editField: undefined,
            changes: false
        });
        this.props.callback(this.state.merged,this.state.widarray);
    }

    cancelChanges = () => {
        this.setState({
            user:this.state.user,
            merged: this.state.user,
            changes: false,
            widarray:[]
        });
    }

    itemChange = (event) => {
        event.dataItem[event.field] = event.value;
        this.setState({
            changes: true
        });
    }

}