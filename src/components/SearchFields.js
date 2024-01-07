import React, { useState } from 'react'
import { Dropdown, Form, InputGroup } from 'react-bootstrap'
import "./SearchFields.css"

const stringContains = (str, query) => {
    return str.trim().toLowerCase().indexOf(query.trim().toLowerCase()) !== -1 
}
 
// If dropdown is passed in, wrap everything in dropdown component and pass remaining props as dropdown props
// Else, Use Dropdown.Menu (to allow highlighting of fields, using Dropdown.Item)
const SearchFields = ({ 
    menuClassName, 
    size, 
    onFieldClick, 
    columns,
    // Needed if these are toggles
    checkboxes, 
    reverseChecks,
    toggleAll,
    isDisabled,
    // Needed if this is a dropdown
    dropdown,
    drop,
    align,
    title, 
    ...props }) => {

    const [fieldQuery, setFieldQuery] = useState("")

    // Checkbox functions
    const checked = (index) => {
        return reverseChecks ? !checkboxes[index] : checkboxes[index]
    }

    const defaultAllActive = () => {
        // If reverseChecks is true, check that all bools are false
        // else, check if all are true 
        let compareBool = !reverseChecks
        return checkboxes.every((bool, index) => {
            if(isDisabled(index)) {
                return true
            }

            return compareBool === bool
        })
    }

    // Could make a "FieldTitle" component which augments 
    // field titles based on the field types with FA icons
    // Might be useful to turn all titles lowercase to prevent unnecessary repeated computation
    const createFields = () => {
        return columns.map((column, index) => {
            if(stringContains(column.title, fieldQuery)) {
                if(checkboxes) {
                    return (
                        <Form.Check
                        key={index}
                        className="mx-3"
                        type="switch" 
                        label={column.title}
                        checked={checked(index)}
                        onChange={() => onFieldClick(index)}
                        disabled={isDisabled(index)} />
                    )
                } else {
                    return (
                        <Dropdown.Item 
                        key={index}
                        onClick={() => onFieldClick(index)}>
                            {column.title}
                        </Dropdown.Item>
                    )
                }
            }

            return <></>
        })
    }

    const createComponent = () => {
        return (
            <div className={`${menuClassName}`}>
                <div className="px-2">
                    <InputGroup size={size}>
                        <Form.Control
                        className="my-2"
                        type='text' 
                        placeholder="Search Fields..."
                        onChange={event => setFieldQuery(event.target.value)} />
                        { checkboxes && toggleAll ? 
                            <Form.Check
                            className='align-self-center mx-2'
                            type="switch"
                            label="All"
                            checked={defaultAllActive()}
                            onChange={(event) => {
                                // Need to do !event.target.checked because for some reason,
                                // it's false if it's checked and true if not
                                toggleAll(!event.target.checked)}
                            }/> 
                            : <></>
                        }
                    </InputGroup>
                </div>
                {createFields()}
            </div>
        )
    }

    return (
        <>
        { dropdown ? (
            <Dropdown drop={drop} align={align}>
                <Dropdown.Toggle size={size} {...props}>
                    {title}
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-0">
                    {createComponent()}
                </Dropdown.Menu>
            </Dropdown>
        ) : createComponent()}
        </>
    )
}

export default SearchFields