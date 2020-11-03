import React from 'react'
import '../App.css';
import axios from 'axios'
import './redboxtheme/redboxtheme.css'
import { Renderers } from './Renderers';
import {Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { orderBy } from '@progress/kendo-data-query';
import { IntlService  } from '@progress/kendo-react-intl';
import BeatLoader from 'react-spinners/BeatLoader';
const DATE_FORMAT='mm-dd-yyyy'
const intl=new IntlService();
export default class Table extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            data:[],
            wellist:[],
            location:[],
            user:[],
            userdata:[],
            editField: undefined,
            changes: false,
            widarray:[],
            sort: [
                { field: 'SpudDate', dir: 'asc' }
            ]};
            this.renderers = new Renderers(this.enterEdit, this.exitEdit, 'inEdit');
    }
    componentDidMount() {
        this.setState({ loading: true });
        setTimeout(() => this.setState({ loading: false }), 1000);
        axios.get('/master')
        .then(res=>{
            const data=res.data;
            // console.log(data)
            this.setState({data:data.map(item=>{
                return{
                    ...item,
                    SpudDate:intl.parseDate(new Date(item.SpudDate),DATE_FORMAT),
                    FracDate:intl.parseDate(new Date(item.FracDate),DATE_FORMAT)
                }
            })})
        })
        axios.get('/location')
        .then(res=>{
            const location=res.data;
            // console.log(location)
            this.setState({location})
        })
        axios.get('/wellist')
        .then(res=>{
            const wellist=res.data;
            // console.log(wellist)
            this.setState({wellist:wellist.map(item=>{
                return {
                    ...item,
                    WI:(parseInt(Math.floor(item.WI*100))).toString().concat("%"),
                    NRI:(parseInt(Math.floor(item.NRI*100))).toString().concat("%")
                }
            })})
        })
        axios.get('/user')
        .then(res=>{
            const user=res.data;
            
            this.setState({userdata:user.map(item=>{
                console.log(typeof(item.WID))
                return {
                    ...item
                }
            })})
            this.setState({user:user.map(item=>{
                return {
                    ...item
                }
            })})
        })
        
      }

      
    render(){    
        console.log(this.state.user)
        console.log(this.state.userdata)
        let merged=[]
        for(let i=0;i<this.state.data.length;i++){
            merged.push({
                ...this.state.data[i],
                ...(this.state.location.find((item)=>item.WID===this.state.data[i].WID)),
                ...(this.state.wellist.find((item)=>item.WID===this.state.data[i].WID)),
                ...(this.state.userdata.find((item)=>item.WID===this.state.data[i].WID))
            })
        }
        return(
            <div>
                {this.state.loading?<BeatLoader color='black' css={{display:'block'}}/> : 
                <div> 
                <Grid
                sort={this.state.sort}
                style={{ height: "850px"}}
                
                data={orderBy(merged,this.state.sort)}
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
                {/* <div id='spinner'><BeatLoader color='black' css={{ display: 'block' }} loading={this.state.loading} /></div> */}
                <Column field="WID" title="Well ID" width="70px" locked={true} editable={false}  />
                <Column field="DPWellName" title="Well Name" width="180px" locked={true} editable={false} />
                <Column field="SpudDate" title="Spud Date" width="85px" format="{0:d}" locked={true} editable={false} />
                <Column field="RigAssignment" title="Drilling Rig" width="70px" editable={false}/>
                <Column field="SHLFNL" title="FNL" width="70px" editable={false}/>
                <Column field="SHLFSL" title="FSL" width="70px" editable={false}/>
                <Column field="SHLFWL" title="FWL"  width="70px" editable={false}/>
                <Column field="SHLFEL" title="FEL" width="70px" editable={false} />
                <Column field="SHLSec" title="Sec" width="50px" editable={false}/>
                <Column field="SHLBlk" title="Blk" width="50px" editable={false}/>
                <Column field="SHLTwnshp" title="Twnshp" width="70px" editable={false}/>
                <Column field="Bench" title="Bench" width="70px" editable={false}/>
                <Column field="WI" title="CR WI" width="70px" editable={false}/>
                <Column field="NRI" title="CR NRI" width="70px" editable={false}/>
                <Column field="FracDate" format="{0:d}" title="Frac Date" width="100px" editable={false}/>
                
                {/*User Inputs*/} 

                <Column field="lease_obligation_date" format="{0:d}" title="Lease Obligation Date" width="100px" />
                <Column field="AFE_send_date" format="{0:d}" title="AFE Send Date" width="100px"/>
                <Column field="AFE_approval_received" format="{0:d}" title="AFE Approval Date" width="100px"/>
                <Column field="pre_plat" format="{0:d}" title="Pre-Plat" width="100px"/>
                <Column field="date_staked" format="{0:d}" title="Date Staked" width="100px" />
                <Column field="title_opinion_approval_date" format="{0:d}" title="Title Opinion Approval Date" width="100px"/>
                <Column field="psa_pooling_ratification_date" format="{0:d}" title="PSA/Pooling Ratification Date" width="100px"/>
                <Column field="permit_approval_date" format="{0:d}" title="Permit Approval Date" width="100px" />
                <Column field="SWR_13_except"  title="SWR13 Except" width="100px"/>
                <Column field="location_build_date" format="{0:d}" title="Location Build Date" width="100px"/>
                <Column field="AFE_Capital_MM"  title="AFE Capital ($MM)" width="100px"/>

            
            </Grid>
                </div>
            }
            </div>
        )
    }
    enterEdit = (dataItem, field) => {
        const userdata = this.state.userdata.map(item => ({
                ...item,
                inEdit: item.WID === dataItem.WID ? field : undefined
            })
        );

        this.setState({
            userdata,
            editField: field
        });
        if(!this.state.widarray.includes(dataItem.WID)){
            this.state.widarray.push(dataItem.WID)
        }
        
    }

    exitEdit = () => {
        const userdata = this.state.userdata.map(item => (
            { ...item, inEdit: undefined }
        ));

        this.setState({
            userdata,
            editField: undefined,
        });
    }

    saveChanges = () => {
        this.setState({
            // user:this.state.data,
            userdata:this.state.userdata,
            editField: undefined,
            changes: false
        });
        this.sendTable();
        
    }

    cancelChanges = () => {
        this.setState({
            user:this.state.user,
            userdata: this.state.user,
            changes: false,
            widarray:[]
        });
        this.sendTable();
    }

    itemChange = (event) => {
        event.dataItem[event.field] = event.value;
        this.setState({
            changes: true
        });
    }
    sendTable(){
        // this.state.data.forEach((item)=>this.state.user.forEach((i)=>{
        //     if(item.WID===i.WID){
        //         console.log(item.location_build_date)
        //         console.log(i.location_build_date)
        //     }
        // // }))
        console.log("Entered send table")
        this.state.widarray.forEach((item)=>{
            console.log(typeof(item))
            console.log(`${item}`);
            const data=this.state.userdata.find((i)=>i.WID===item)
            axios.put(`/user/${item}`,data).then(res=>console.log(res.data))
        })
        // this.state.widarray.forEach((item)=>{
        //     Axios.put(`/user/${item.WID}`,this.state.data)
        // })
        this.state.widarray.forEach((item)=>console.log(item))
    }

    
}