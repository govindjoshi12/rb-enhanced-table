import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';

// size object:
// { title: "...", value: "..." }
function TableSettings({ size, setTableSize, sizes }) {

    const createDropdownItems = () => (
        sizes.map((item, index)=> (
            <Dropdown.Item 
            key={index} 
            onClick={() => setTableSize(item)}
            active={item === size}>
                {item.title}
            </Dropdown.Item>
        ))
    )

    return (
        <Dropdown className="h-100">
            <Dropdown.Toggle         
            className="w-100 h-100"
            variant="outline-secondary" 
            size={size.value}>
                <FontAwesomeIcon icon={faGear} /> Settings
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {createDropdownItems()}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default TableSettings;