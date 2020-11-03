import React from 'react';

export class Renderers{
    constructor(enterEdit, exitEdit, editFieldName) {
        this.enterEdit = enterEdit;
        this.exitEdit = exitEdit;
        this.editFieldName = editFieldName;
    }

    cellRender = (tdElement, cellProps) => {
        const dataItem = cellProps.dataItem;
        const cellField = cellProps.field;
        const inEditField = dataItem[this.editFieldName];
        var tdProps={
            ...tdElement.props
        }
        if(cellField==='AFE_send_date'){
            const example = new Date(cellProps.dataItem.SpudDate).getTime() - new Date(cellProps.dataItem.AFE_send_date).getTime();
            const days=Math.floor(example/(1000*60*60*24))<=120;
            const red = { backgroundColor: "rgb(243, 23, 0, 0.32)" };
            const style={backgroundColor: days ?
                "rgb(243, 23, 0, 0.32)" :
                ""}
            tdProps={
                ...tdElement.props,
                style:style
            }
        }
        if(cellField==='AFE_approval_received'){
            const example = new Date(cellProps.dataItem.SpudDate).getTime() - new Date(cellProps.dataItem.AFE_approval_received).getTime();
            const days=Math.floor(example/(1000*60*60*24))<=45;
            const red = { backgroundColor: "rgb(243, 23, 0, 0.32)" };
            const style={backgroundColor: days ?
                "rgb(243, 23, 0, 0.32)" :
                ""}
            tdProps={
                ...tdElement.props,
                style:style
            }
        }
        if(cellField==='date_staked'){
            const example = new Date(cellProps.dataItem.SpudDate).getTime() - new Date(cellProps.dataItem.date_staked).getTime();
            const days=Math.floor(example/(1000*60*60*24))<=300;
            const red = { backgroundColor: "rgb(243, 23, 0, 0.32)" };
            const style={backgroundColor: days ?
                "rgb(243, 23, 0, 0.32)" :
                ""}
            tdProps={
                ...tdElement.props,
                style:style
            }
        }
        if(cellField==='permit_approval_date'){
            const example = new Date(cellProps.dataItem.SpudDate).getTime() - new Date(cellProps.dataItem.permit_approval_date).getTime();
            const days=Math.floor(example/(1000*60*60*24))<=120;
            const red = { backgroundColor: "rgb(243, 23, 0, 0.32)" };
            const style={backgroundColor: days ?
                "rgb(243, 23, 0, 0.32)" :
                ""}
            tdProps={
                ...tdElement.props,
                style:style
            }
        }
        if(cellField==='psa_pooling_ratification_date'){
            const example = new Date(cellProps.dataItem.SpudDate).getTime() - new Date(cellProps.dataItem.psa_pooling_ratification_date).getTime();
            const days=Math.floor(example/(1000*60*60*24))<=90;
            const red = { backgroundColor: "rgb(243, 23, 0, 0.32)" };
            const style={backgroundColor: days ?
                "rgb(243, 23, 0, 0.32)" :
                ""}
            tdProps={
                ...tdElement.props,
                style:style
            }
        }

        const additionalProps = cellField &&  cellField === inEditField ?
            {
                ref: (td) => {
                    const input = td && td.querySelector('input');
                    const activeElement = document.activeElement;
                    

                    if (!input ||
                        !activeElement ||
                        input === activeElement ||
                        !activeElement.contains(input)) {
                            // console.log(input.value)
                        return;
                    }

                    if (input.type === 'checkbox') {
                        input.focus();
                    } else {
                        input.select();
                    }
                }
                
            } : {
                onClick: () => { this.enterEdit(dataItem, cellField); }
            };
            // console.log(tdElement.value)
        return React.cloneElement(tdElement, { ...tdProps, ...additionalProps }, tdElement.props.children);
    }

    rowRender = (trElement) => {
        
        const trProps = {
            ...trElement.props,
            
            onMouseDown: () => {
                this.preventExit = true;
                clearTimeout(this.preventExitTimeout);
                this.preventExitTimeout = setTimeout(() => { this.preventExit = undefined; });
            },
            onBlur: () => {
                clearTimeout(this.blurTimeout);
                if (!this.preventExit) {
                    this.blurTimeout = setTimeout(() => { this.exitEdit(); });
                }
            },
            onFocus: () => { clearTimeout(this.blurTimeout); }
        };
        return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
    }

}