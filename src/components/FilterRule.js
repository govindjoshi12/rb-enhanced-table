import React, { useCallback } from "react";
import { CloseButton, Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";

/* 
    rule: {
        column: column object,
        operation: "...",
        value: "..."
    }
*/

// text operators
// other notion ops: starts with, ends with, is empty, is not empty
const textOperators = [
    "is",
    "is not",
    "contains",
    "does not contain"
]

// Numbers
// other notion: is empty, is not empty
const numberOperators = [
    "=",
    "≠",
    ">",
    "<",
    "≥",
    "≤"
]

// Dates
// Unknown values are 1/1/1900 right now
const dateOperators = [
    "is",
    "is not",
    "is before",
    "is after",
    "is on or before",
    "is on or after"
]

// Can implement custom dates later
const dateValues = [
    "Today",
    "Yesterday",
    "1 Week Ago",
    "1 Month Ago",
    "3 Months Ago",
    "6 Months Ago",
    "1 Year Ago",
    "2 Years Ago",
    "3 Years Ago",
    "Unknown"
]

// missing is empty, is not empty
const selectOperators = [
    "is",
    "is not"
]

// checkbox
// checkbox shares selectOperators
const checkboxValues = [
    "Yes",
    "No",
    "Unknown"
]

const getOperators = (columnType) => {

    let operators
    switch(columnType) {
        case "text": operators = textOperators; break;
        case "number": operators = numberOperators; break;
        case "date": operators = dateOperators; break;
        case "select": operators = selectOperators; break;
        case "checkbox": operators = selectOperators; break;
        default: break;
    }

    return operators
}

const getSelectValues = (column) => {

    let possibleValues
    switch(column.field) {
        case "date": possibleValues = dateValues; break;
        case "select": possibleValues = column.selectOptions; break;
        case "checkbox": possibleValues = checkboxValues; break;
        default: break;
    }

    return possibleValues
}

export const newEmptySimpleRule = (column) => {

    let value = ""
    if(column.field !== "text" && column.field !== "number") {
        value = getSelectValues(column)[0]
    }

    return {
        column: column,
        operation: getOperators(column.field)[0],
        value: value
    }
}

// text, number, date, select, checkbox
// sets local filters or parent advanced rule
const FilterRule = ({
    rule,
    ruleIndex,
    setFilters
}) => {

    // column is constant for now, so no need to change it to state
    const column = rule.column
    const operation = rule.operation
    const value = rule.value

    const deleteFilter = useCallback(() => {
        setFilters(currFilters => (
            currFilters.filter((filter, index) => index !== ruleIndex)
        ))
    }, [setFilters, ruleIndex])

    const updateOperation = useCallback((newOperation) => {
        setFilters(currFilters => (
            currFilters.map((filter, index) => {
                if(ruleIndex === index) {
                    return {
                        ...filter,
                        operation: newOperation
                    }
                }

                return filter
            })
        ))
    }, [setFilters, ruleIndex])

    const updateValue = useCallback((newValue) => {
        setFilters(currFilters => (
            currFilters.map((filter, index) => {
                if(ruleIndex === index) {
                    return {
                        ...filter,
                        value: newValue
                    }
                }

                return filter
            })
        ))
    }, [setFilters, ruleIndex])

    const createOperatorsDropdown = () => {

        let operators = getOperators(column.field)

        // Key here actually works as index because
        // this array, when it exists, will always be static
        return operators.map((op, index) => (
            <Dropdown.Item 
            key={index} 
            active={operation === op}
            onClick={() => updateOperation(op)}>
                {op}
            </Dropdown.Item>
        ))
    }

    const createValueInput = () => {
        // If text or number, use input text box
        // else, use correct selection options

        if(column.field === "text" || column.field === "number") {
            return (
                <Form.Control 
                type={column.field}
                placeholder="Value"
                value={value}
                onChange={(event) => updateValue(event.target.value)} />
            )
        }

        let possibleValues = getSelectValues(column)

        return (
            <Dropdown>
                <Dropdown.Toggle
                className="flex-grow-1 text-start"
                variant="outline-secondary">
                    {value}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {possibleValues.map((possibleVal, index) => (
                        <Dropdown.Item 
                        key={index} 
                        active={possibleVal === value}
                        onClick={() => updateValue(possibleVal)}>
                            {possibleVal}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    return (
        <div className="d-flex flex-row">
            <InputGroup size="sm">
                <InputGroup.Text>{column.title}</InputGroup.Text>
                <DropdownButton 
                variant="outline-secondary"
                title={operation}>
                    {createOperatorsDropdown()}
                </DropdownButton>
                {createValueInput()}
                {/* value input is not rounded :( */}
            </InputGroup>
            <CloseButton className="align-self-center ms-2" onClick={deleteFilter} />
        </div>
    )
}

export default FilterRule