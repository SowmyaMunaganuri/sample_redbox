import React, { Component, Fragment } from "react";
import { getRedbox } from "./Utils";
import {Redirect} from "react-router-dom"
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { AgGridReact } from "ag-grid-react";
import BeatLoader from "react-spinners/BeatLoader";
import "../App.css";
import Moment from "moment";
function identifyRedBox(params) {
  //return CSS styles to cellClass for columns between AFE SendDate and Location Build
  if (params.data.IsNoaFiled && params.colDef.field === "PermitApproved") {
    //if NoaFiled is true, only PermitApproved column value should be red text though it is "Red"Box
    return "noafiled-red-text";
  } else if (params.value === "Red") {
    //All column values with "Red" should be transparent redboxes
    return "redboxes";
  }
}

function dateFormatter(date) {
  //Converting date from YYYYMMDD to M/D/YY
  if (Moment(date).isValid()) {
    return Moment(date).format("M/D/YY");
  } else {
    return date;
  }
}

function percentFormatter(value) {
  //converting float point to percentage
  return Math.round(value * 100) + "%";
}

function capFormatter(value) {
  if (value) {
    return value.toFixed(2);
  }
}

function spudFormatter(date) {
  // Converting ISO date format to M/D/YY
  if (Moment(date).isValid()) {
    return Moment(date).format("M/D/YY");
  } else {
    return null;
  }
}
export default class RedBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Spudder Date",
          field: "SpudderDate",
          valueFormatter: function (params) {
            return spudFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return spudFormatter(params.value);
            },
          },
        },
        {
          headerName: "SpudDate",
          field: "SpudDate",
          valueFormatter: function (params) {
            return spudFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return spudFormatter(params.value);
            },
          },
        },
        {
          headerName: "Rig Release Date",
          field: "RigReleaseDate",
          valueFormatter: function (params) {
            return spudFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return spudFormatter(params.value);
            },
          },
        },
        {
          headerName: "Well Name",
          field: "WellName",
          width: "fit-content",
        },
        {
          headerName: "Rig",
          field: "DrillingRig",
          width: "70",
        },
        {
          headerName: "FNL",
          field: "FNL",
          width: "70",
        },
        {
          headerName: "FSL",
          field: "FSL",
          width: "70",
        },
        {
          headerName: "FWL",
          field: "FWL",
          width: "70",
        },
        {
          headerName: "FEL",
          field: "FEL",
          width: "70",
        },
        {
          headerName: "Sec",
          field: "Section",
          width: "70",
        },
        {
          headerName: "Blk",
          field: "Block",
          width: "70",
        },
        {
          headerName: "Twn",
          field: "Township",
          width: "70",
        },
        {
          headerName: "County",
          field: "County",
          width: "85",
        },
        {
          headerName: "Bench",
          field: "Bench",
          width: "85",
        },
        {
          headerName: "Lease Oblig Date",
          field: "LeaseObligation",
        },
        {
          headerName: "CR WI",
          field: "CrownRockWI",
          width: "85",
          valueFormatter: function (params) {
            return percentFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return percentFormatter(params.value);
            },
          },
        },
        {
          headerName: "CR NRI",
          field: "CrownRockNRI",
          width: "85",
          valueFormatter: function (params) {
            return percentFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return percentFormatter(params.value);
            },
          },
        },
        {
          headerName: "AFE SendDate",
          field: "AfeSent",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "AFE Approved Received",
          field: "AfeApproved",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "Pre-Plat",
          field: "PrePlat",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "Date Staked",
          field: "Staked",
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "Title Opinion Approved",
          field: "TitleOpinion",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "PSA/Pooling Ratif",
          field: "PoolingRatification",
          //This column has no cellClass because it can never be a RedBox
          valueFormatter: function (params) {
            if (params.value === "") {
              console.log(params);
            }
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "Permit Approved",
          field: "PermitApproved",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "SWR 13 Exception",
          field: "Swr13Exception",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "Location Build",
          field: "LocationBuild",
          cellClass: function (params) {
            return identifyRedBox(params);
          },
          valueFormatter: function (params) {
            return dateFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return dateFormatter(params.value);
            },
          },
        },
        {
          headerName: "AFE Cap ($MM)",
          field: "AfeCapital",
          valueFormatter: function (params) {
            return capFormatter(params.value);
          },
          filterParams: {
            valueFormatter: function (params) {
              return capFormatter(params.value);
            },
          },
        },
      ],

      defaultColDef: {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true,
        width: "100",
        headerClass: function () {
          //Header styling
          return "header";
        },
      },
      rowData: [],
      modules: AllModules,
    };
  }
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setHeaderHeight(60);
  };
  rowEdit = (params) => {
    if (new Date(params.data.SpudDate) < new Date()) {
      //SpudDate less than today has to be BlueRows
      return {
        color: "cornflowerblue",
        textAlign: "center",
        fontWeight: "bold",
      };
    }
    return { textAlign: "center" };
  };
  componentDidMount() {
    console.log("RedBox mounted!");
    let data = JSON.parse(getRedbox());
    this.setState({ rowData: data });
  }
  render() {
    return (
      <Fragment>
        {this.props.isUser === "true" ? (
          <Redirect to="/app/redbox" />
        ) : (
          (window.location.href = "/")
        )}

        <div
          className="ag-theme-balham-dark"
          style={{ height: "calc(92vh - 50px)" }}
        >
          {this.state.loading ? (
            <BeatLoader color="white" />
          ) : (
            <AgGridReact
              modules={this.state.modules}
              enableRangeSelection={true}
              defaultColDef={this.state.defaultColDef}
              onGridReady={this.onGridReady}
              suppressRowClickSelection={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              getRowStyle={this.rowEdit}
            ></AgGridReact>
          )}
        </div>
      </Fragment>
    );
  }
}
