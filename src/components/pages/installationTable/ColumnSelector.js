import React, { Component } from 'react';
import './ColumnSelector.scss';
import update from 'immutability-helper';

class ColumnSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkboxes: this.props.seedColumns.map(column =>{ return { name: column, checked: false }})
        }
    }

    onCheckboxClick(e) {
        let checkBoxes = this.state.checkboxes;
        let checkBoxIndex = checkBoxes.findIndex(checkbox => checkbox.name === e.target.name)
        let newCheckedStatus = !this.state.checkboxes[checkBoxIndex].checked;
     
        if (newCheckedStatus) {
            this.props.addToShownColumns(e.target.name);
        } else {
            this.props.removeFromShownColumns(e.target.name);
        }
        
        this.setState({
            checkboxes: update(this.state.checkboxes, {[checkBoxIndex]: {checked: {$set: newCheckedStatus}}})
        })
    }

    render() {
        let checkBoxes = this.state.checkboxes.map(column => {
                return <div className="checkbox-container">
                    <input type="checkbox" name={column.name} onClick={(e) => { this.onCheckboxClick(e) }}/>
                    <div className="text">{column.name}</div>
                </div>
            })

        return <div className="column-selector-checkbox-container">
            {checkBoxes}
        </div>;
    }
}

export default ColumnSelector;