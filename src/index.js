import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppTabs from "./AppTabs"

import {LicenseManager} from "@ag-grid-enterprise/core";
LicenseManager.setLicenseKey("CompanyName=CrownQuest Operating,LicensedGroup=crownquest,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-008508,ExpiryDate=11_June_2021_[v2]_MTYyMzM2NjAwMDAwMA==e31d058c0f8940a5ed6dcf0557a2644b");
ReactDOM.render(
    <App />,
  document.getElementById('root')
);