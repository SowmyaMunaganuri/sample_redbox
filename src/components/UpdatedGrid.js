import React from "react";
import Moment from "moment";
import Axios from 'axios';
import "../App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import SpudEditor from "./DateEditor";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { AgGridReact } from "ag-grid-react";

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: [],
      modules: AllModules,
      columnDefs: [
        {
          field: "WID",
          headerName: "Well ID",
          width: "70px",
          pinned: "left",
          lockPosition: true,
          editable: false,
        },
        {
          field: "DPWellName",
          headerName: "Well Name",
          width: "180px",
          pinned: "left",
          lockPosition: true,
          editable: false,
        },
        {
          field: "SpudDate",
          headerName: "Spud Date",
          width: "85px",
          pinned: "left",
          lockPosition: true,
          editable: false,
        },
        {
          field: "FracDate",
          headerName: "Frac Date",
          width: "100px",
          pinned: "left",
          lockPosition: true,
          editable: false,
          cellEditor: "datePicker",
        },
        {
          field: "RigAssignment",
          headerName: "Drilling Rig",
          width: "70px",
          editable: false,
        },
        { field: "SHLFNL", headerName: "FNL", width: "70px", editable: false },
        { field: "SHLFSL", headerName: "FSL", width: "70px", editable: false },
        { field: "SHLFWL", headerName: "FWL", width: "70px", editable: false },
        { field: "SHLFEL", headerName: "FEL", width: "70px", editable: false },
        { field: "SHLSec", headerName: "Sec", width: "50px", editable: false },
        { field: "SHLBlk", headerName: "Blk", width: "50px", editable: false },
        {
          field: "SHLTwnshp",
          headerName: "Twnshp",
          width: "70px",
          editable: false,
        },
        { field: "Bench", headerName: "Bench", width: "70px", editable: false },
        { field: "WI", headerName: "CR WI", width: "70px", editable: false },
        { field: "NRI", headerName: "CR NRI", width: "70px", editable: false },

        {
          field: "lease_obligation_date",
          headerName: "Lease Obligation Date",
          width: "100px",
          cellEditor: "datePicker",
        },
        {
          field: "AFE_send_date",
          headerName: "AFE Send Date",
          width: "100px",
          cellEditor: "datePicker",
          cellClass: function (params) {
            const days=Math.floor((new Date(params.data.SpudDate) - new Date(params.data.AFE_send_date))/(1000*60*60*24))<=120
            
            return days
              ? "sick-days-warning"
              : "";
          },
        },
        {
          field: "AFE_approval_received",
          headerName: "AFE Approval Date",
          width: "100px",
          cellEditor: "datePicker",
          cellClass: function (params) {
            const days=Math.floor((new Date(params.data.SpudDate) - new Date(params.data.AFE_approval_received))/(1000*60*60*24))<=45
            
            return days
              ? "sick-days-warning"
              : "";
          },
        },
        { field: "pre_plat", headerName: "Pre-Plat", width: "100px" },
        {
          field: "date_staked",
          headerName: "Date Staked",
          width: "100px",
          cellEditor: "datePicker",
          cellClass: function (params) {
            const days=Math.floor((new Date(params.data.SpudDate) - new Date(params.data.date_staked))/(1000*60*60*24))<=300
            
            return days
              ? "sick-days-warning"
              : "";
          },
        },
        {
          field: "title_opinion_approval_date",
          headerName: "Title Opinion Approval Date",
          width: "100px",
        },
        {
          field: "psa_pooling_ratification_date",
          headerName: "PSA/Pooling Ratification Date",
          width: "100px",
        },
        {
          field: "permit_approval_date",
          headerName: "Permit Approval Date",
          width: "100px",
          cellEditor: "datePicker",
          cellClass: function (params) {
            const days=Math.floor((new Date(params.data.SpudDate) - new Date(params.data.permit_approval_date))/(1000*60*60*24))<=120
            return days
              ? "sick-days-warning"
              : "";
          },
        },
        { field: "SWR_13_except", headerName: "SWR13 Except", width: "100px" },
        {
          field: "location_build_date",
          headerName: "Location Build Date",
          width: "100px",
        },

        {
          field: "AFE_Capital_MM",
          headerName: "AFE Capital ($MM)",
          width: "100px",
        },
      ],
      components: {
        datePicker: SpudEditor,
      },
      defaultColDef: {
        suppressMovable: true,
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: "50",
        rowStyle:{height:"10px"}
      },
      rowData: [],
      undoRedoCellEditingLimit: 5,
    };
  }

  componentDidMount() {
    this.setState({ rowData: this.props.grid_data });
  }
  undo = () => {
    this.gridApi.undoCellEditing();
  };

  redo = () => {
    this.gridApi.redoCellEditing();
  };
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  };
  onDelete=(e)=>{
    this.setState({index:[]})
    this.setState({ rowData: this.props.grid_data });
    window.location.reload(false);
  }
  onUpdate = (e) => {
    e.preventDefault();
    console.log("Update");
    var update = [];
    var data_update=[]
    this.state.index.map((node) => {
          if (!update.includes(node)) {
            update.push(node);
          }
    });
    update.forEach((element) => {
      data_update.push({
        ...element,
        AFE_send_date:Moment(element.AFE_send_date).isValid()
        ? Moment(element.AFE_send_date).format("MM/DD/yyyy")
        : "",
        AFE_approval_received:Moment(element.AFE_approval_received).isValid()
        ? Moment(element.AFE_approval_received).format("MM/DD/yyyy")
        : "",
        date_staked:Moment(element.date_staked).isValid()
        ? Moment(element.date_staked).format("MM/DD/yyyy")
        : "",
        permit_approval_date:Moment(element.permit_approval_date).isValid()
        ? Moment(element.permit_approval_date).format("MM/DD/yyyy")
        : "",
      })
    })
    
    data_update.forEach((data)=>{
      console.log(data)
      const item=data.WID
      console.log(item)
      Axios.put(`/user/${item}`,data)
                .then(res=>console.log(res.data))
                .catch(err=>{
                    if(err.response.status===404){
                        Axios.post(`/user/newid`,data)
                        .then(res=>console.log(res.data))
                        Axios.put(`/user/${item}`,data)
                        .then(res=>console.log(res.data))
                    }
                })
    })
    this.setState({index:[]})
    this.props.callback()
    this.setState({ rowData: this.props.grid_data });
    window.location.reload(false);
  };

  onQuickFilterChanged = () => {
    this.gridApi.setQuickFilter(document.getElementById("quickFilter").value);
  };
  onCellValueChanged = (params) => {
    console.log(params);
    console.log("Callback onCellValueChanged:", params);
    this.setState({
      index: [...this.state.index, params.data],
    });
  };

  onPasteStart = (params) => {
    console.log("Callback onPasteStart:", params);
  };

  onPasteEnd = (params) => {
    console.log("Callback onPasteEnd:", params);
  };

  render() {
    console.log(this.state.rowData);
    console.log(this.state.index);
    return (
      <div
        id="my-form"
      >
        <div
          className="form-group"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <div className="btn-group mr-2">
              <button className="btn btn-success" onClick={this.onUpdate}>
                SAVE
              </button>
            </div>
            <div className="btn-group mr-2">
              <button className="btn btn-danger" onClick={this.onDelete}>
                CANCEL
              </button>
            </div>
          </div>

          <div>
            <div className="btn-group mr-2">
              <input
                type="text"
                id="quickFilter"
                onInput={() => this.onQuickFilterChanged()}
                placeholder="SEARCH ..."
              />
            </div>
          </div>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ height: "82vh" }}
        >
          <AgGridReact
            modules={this.state.modules}
            defaultColDef={this.state.defaultColDef}
            onGridReady={this.onGridReady}
            suppressRowClickSelection={true}
            columnDefs={this.state.columnDefs}
            enableCellChangeFlash={true}
            rowData={this.state.rowData}
            onCellValueChanged={this.onCellValueChanged.bind(this)}
            frameworkComponents={this.state.components}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}
