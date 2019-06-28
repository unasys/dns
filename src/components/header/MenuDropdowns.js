// Example multi-leveled dropdown component 
// import React from 'react';
// import { NestedDropdownMenu } from 'react-dd-menu';

// export default [
// {
//     inverse: true,
//     align: 'left',
//     text: 'Test Tab',
//     additionalItems: (
//       <NestedDropdownMenu animate={true} toggle={<button type="button">Multi-level Menu   <span className="fa fa-chevron-right" /></button>}>
//         <li><a href="#">Wee wooo</a></li>
//         <li><a href="#">Wee wooo</a></li>
//         <li role="separator" className="separator" />
//         <NestedDropdownMenu nested={'left'} animate={true} toggle={<button type="button">Multi-level Menu   <span className="fa fa-chevron-right" /></button>}>
//           <li><a href="#">Wee wooo 1</a></li>
//           <li><a href="#">Wee wooo 2</a></li>
//           <li><a href="#">Wee wooo 3</a></li>
//           <NestedDropdownMenu nested={'left'} animate={true} toggle={<button type="button">Multi-level Menu   <span className="fa fa-chevron-right" /></button>}>
//             <li><a href="#">I Think You Got It</a></li>
//           </NestedDropdownMenu>
//         </NestedDropdownMenu>
//       </NestedDropdownMenu>
//     ),
    
//   }
// ]

//call to show
// import Options from './Options';
// import MenuDropdowns from './MenuDropdowns';
// <div className="dd-menu dd-menu-left dd-menu-inverse "></div>
// {Options.map(opts => {
//     return <MenuDropdowns {...opts} key={opts.text} />;
//   })}

import React, { Component } from 'react';
import classnames from 'classnames';
import DropdownMenu from 'react-dd-menu';
import '../../../node_modules/react-dd-menu/src/scss/react-dd-menu.scss';

export default class MenuDropdowns extends Component {
    constructor(props) {
      super(props);
      this.state = { isOpen: false };
    }
  
    toggleMenu = () => {
      this.setState({ isOpen: !this.state.isOpen });
    };
  
    closeMenu = () => {
      this.setState({ isOpen: false });
    };
  
    render() {
      const { isOpen } = this.state;
      const { text, additionalItems, nestedProps, ...props } = this.props;
      const opts = {
        close: this.closeMenu,
        isOpen: isOpen,
        toggle: (
          <div className={classnames('tab', { 'active': isOpen })}>
            <button type="button" onClick={this.toggleMenu}>{text}</button>
          </div>
        ),
      };
  
      let toggle = null;
      if(nestedProps) {
        let nested = null;
        switch(nestedProps.nested) {
          case 'left':
          case 'right':
            nested = nestedProps.nested;
            break;
          case 'inherit':
            nested = props.align;
            break;
          default:
            nested = props.align === 'left' ? 'right' : 'left';
        }
  
        const icon = <span className={`fa fa-chevron-${nested}`} />;
        toggle = (
          <button type="button">
            {nested === 'left' && icon}
            Hover for Nested menu
            {nested === 'right' && icon}
          </button>
        );
      }
      
      return (
        <DropdownMenu {...props} {...opts}>
          {/* <li><a href="#">Link Example</a></li>
          <li><button type="button" onClick={this.onClick}>Button Example</button></li> */}
          {additionalItems}
        </DropdownMenu>
      );
    }
  }