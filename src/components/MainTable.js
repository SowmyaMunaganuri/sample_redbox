
import React from 'react'
import '../App.css';
import Axios from 'axios';
import './redboxtheme/redboxtheme.css'

import { IntlService  } from '@progress/kendo-react-intl';
import BeatLoader from 'react-spinners/BeatLoader';
// import GridComponent from './Grid';
import GridComponent from "./UpdatedGrid"
const DATE_FORMAT='mm-dd-yyyy'
const intl=new IntlService();

export default class MainTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            data:[],
            wellist:[],
            location:[],
            userdata:[],
            user:[]
        };
        this.callback=this.callback.bind(this)
        this.api_calls=this.api_calls.bind(this)
    }
    api_calls(){
        Axios.get('/master')
        .then(res=>{
            const data=res.data;
            // console.log(data)
            this.setState({data:data.map(item=>{
                return{
                    ...item,
                    // SpudDate:intl.parseDate(new Date(item.SpudDate),DATE_FORMAT),
                    // FracDate:intl.parseDate(new Date(item.FracDate),DATE_FORMAT)
                }
            })})

        })
        Axios.get('/location')
        .then(res=>{
            const location=res.data;
            // console.log(location)
            this.setState({location})

        })
        Axios.get('/wellist')
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
        Axios.get('/user')
        .then(res=>{
            const user=res.data;
            this.setState({userdata:user.map(item=>{
                return {
                    ...item
                    // AFE_send_date:intl.parseDate(new Date(item.AFE_send_date),DATE_FORMAT),
                    // AFE_approval_date:intl.parseDate(new Date(item.AFE_approval_date),DATE_FORMAT),
                    // date_staked:intl.parseDate(new Date(item.date_staked),DATE_FORMAT),
                    // SWR_13_except:intl.parseDate(new Date(item.SWR_13_except),DATE_FORMAT),
                    // permit_approval_date:intl.parseDate(new Date(item.permit_approval_date),DATE_FORMAT),
                }
            })})
            this.setState({user:user.map(item=>{
                return {
                    ...item
                }
            })})
        })

    }
    callback(){
        console.log("Entered send table")
    //    data_update.forEach((data)=>{
    //   console.log(data)
    //   const item=data.WID
    //   console.log(item)
    //   Axios.put(`/user/${item}`,data)
    //             .then(res=>console.log(res.data))
    //             .catch(err=>{
    //                 if(err.response.status===404){
    //                     Axios.post(`/user/newid`,data)
    //                     .then(res=>console.log(res.data))
    //                     Axios.put(`/user/${item}`,data)
    //                     .then(res=>console.log(res.data))
    //                 }
    //             })
    // })
      this.api_calls()
    }
    componentDidMount(){
        this.setState({ loading: true });
        setTimeout(() => this.setState({ loading: false }), 1000);
        this.api_calls()
    }

    render() {
   
         let merged=[]
        //  merged.push({
        //     AFE_Capital_MM: "",
        //     AFE_approval_received: "45",
        //     AFE_send_date: "120",
        //     Bench: "",
        //     DPWellName: "",
        //     FracDate: "",
        //     NRI: "",
        //     RigAssignment: "",
        //     SHLBlk: "",
        //     SHLFEL: "",
        //     SHLFNL: "",
        //     SHLFSL: "",
        //     SHLFWL: "",
        //     SHLSec: "",
        //     SHLTwnshp: "",
        //     SWR_13_except: "90",
        //     SpudDate:"",
        //     WI: "",
        //     WID: '',
        //     date_staked: "300",
        //     lease_obligation_date: "",
        //     location_build_date: "210",
        //     permit_approval_date: "120",
        //     pre_plat: "365",
        //     psa_pooling_ratification_date: "90",
        //     title_opinion_approval_date: "180"
        //  })
        for(let i=0;i<this.state.data.length;i++){
            merged.push({
                ...this.state.data[i],
                ...(this.state.location.find((item)=>item.WID===this.state.data[i].WID)),
                ...(this.state.wellist.find((item)=>item.WID===this.state.data[i].WID)),
                ...(this.state.userdata.find((item)=>item.WID===this.state.data[i].WID))
            })
        }
        // console.log(merged)
        return (
            <div>
                {this.state.loading?<BeatLoader color='black' 
                /> :
                    // <GridComponent grid_data={merged} callback={this.callback} wid_array={[]}/>
                    <GridComponent grid_data={merged} callback={this.callback}/>
                }
            </div>
        );
    }

    

}


