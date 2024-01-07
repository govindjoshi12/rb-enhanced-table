import React, { useCallback } from "react";
import { Container, Row, Col, Button, DropdownButton, Dropdown, CloseButton } from 'react-bootstrap'
import SearchFields from "./SearchFields";
import FilterRule, { newEmptySimpleRule } from "./FilterRule";
import "./FilterGroup.css"

// text, number, date, select, checkbox

// For now, disallowing nested advanced filters

// The way it's currently structured, all filters are ANDs
// Will add "OR" dropdown soon

/*
    rule: {
        column: column object,
        operation: string like: "is", "is not", "contains", "does not contain",
        value: ...,
        TODO: for dates, add option for custom dates LATER
    }

    group: [
        rule,
        rule,
        group [],
        rule...
    ]

    top level filters array is a group
*/

/* 
    Tried using objects as rule groups but
    react does not like objects with arrays being added to arrays.
    Defaulting to regular arrays with convention that first item in 
    array is a boolean which is true if filters are additive, false
    if they are "or-ed"
*/

export const newEmptyFilterGroupArray = () => {
    return [true]
}

// 1-indexed, because index 0 contains and boolean
// toplevel group doesn't need to deal with group index
const FilterGroup = ({
    groupArray,
    setFilters,
    columns,
    topLevel
}) => {

    let and = groupArray[0]
    let rules = groupArray.slice(1)

    // Identical to the method in FilterRule... 
    // Uses groupIndex; ONLY deletable when not toplevel
    const deleteFilter = useCallback(() => {

        // Since a filter group is only aware of its own array, just set it to null
        setFilters(() => null)
    }, [setFilters])

    const addSimpleRule = useCallback((column) => {
        setFilters(currFilters => [...currFilters, newEmptySimpleRule(column)])
    }, [setFilters])

    const addAdvancedRule = useCallback(() => {
        setFilters(currFilters => [...currFilters, newEmptyFilterGroupArray()])
    }, [setFilters])

    const setAndOr = useCallback((and) => {
        setFilters(currFilters => {
            currFilters[0] = and
            return [...currFilters]
        })
    }, [setFilters])

    // ensure that children filters update current group
    // NO WAY THIS ACTUALLY WORKED HOLY GUACAMOLE
    const setGroupFilters = (updaterFunction, childGroupIndex) => {

        setFilters(currFilters => {

            // Call the updater function with the filter group array 
            // that this current object represents

            let arrayToUpdate = currFilters[childGroupIndex]
            let newGroupArray = updaterFunction(arrayToUpdate)

            // when a filter group deletes itself, it calls setFilters(null),
            // so newGroupArray would be null. To remove null values, we can use flatMap.
            // Return [] to remove, return [item] to keep, return [item1, item2] to add objects
            return currFilters.flatMap((filter, index) => {
                if(index === childGroupIndex) {
                    return newGroupArray ? [newGroupArray] : []
                } 

                return [filter]
            })
        })
    }

    const createAndOrDropdown = () => {
        return (
            <DropdownButton variant="outline-secondary" size="sm" title={and ? "And" : "Or"}>
                <Dropdown.Item onClick={() => setAndOr(true)}>
                    And
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setAndOr(false)}>
                    Or
                </Dropdown.Item>
            </DropdownButton>
        )
    }

    const createFilterGroup = () => (
        <Container className={topLevel ? "tl-ar-container" : "ar-container py-2"} fluid={topLevel}>
            { topLevel && rules.length === 0 ? (
                <Row><Col>No Filters</Col></Row>
            ) : <></>}
            { rules.map((item, index) => {
                let filter 

                // If item is an array, it's a rule group, else it's a rule object

                // Need to pass a special version of setFilters to an advanced group
                // so it only updates its own array
                if(Array.isArray(item)) {
                    filter = (
                        <FilterGroup 
                        groupArray={item} 
                        setFilters={(updaterFunction) => setGroupFilters(updaterFunction, index + 1)} 
                        columns={columns} />
                    )
                } else {
                    // Rule
                    // Index needs to be incremented by one,
                    // because FilterRule will update filters based on whole array
                    // and we are iterating over the sliced array here
                    filter = (
                        <FilterRule 
                        rule={item}
                        ruleIndex={index + 1}
                        setFilters={setFilters} />
                    )
                }

                return (
                    <Row key={index} className="mb-2">
                        <Col xs="2" className="d-flex justify-content-end align-items-center">
                            { index === 0 ? <>Where&nbsp;</> : 
                                index === 1 ? createAndOrDropdown() : 
                                and ? "And" : "Or"
                            }
                        </Col>
                        <Col>{filter}</Col>
                    </Row>
                )
            }) }
            { topLevel ? <hr /> : rules.length !== 0 ? <hr className="my-2" /> : <></>}
            <Row className="gx-2">
                <Col xs="auto">
                    <SearchFields 
                    menuClassName="sort-dropdown-search-fields"
                    onFieldClick={(index) => {
                        addSimpleRule(columns[index])
                    }}
                    columns={columns}
                    dropdown={true}
                    align="end"
                    variant="outline-primary"
                    size="sm"
                    title="Add Rule"/>
                </Col>
                { topLevel ? (
                    <>
                        <Col xs="auto">
                            <Button
                            onClick={addAdvancedRule}
                            variant="outline-primary" 
                            size="sm">
                                Add Rule Group
                            </Button>
                        </Col>
                        <Col xs="sm">
                            <Button
                            onClick={() => setFilters(newEmptyFilterGroupArray())}
                            variant="outline-danger" 
                            size="sm">
                                Clear All
                            </Button>
                        </Col>
                    </>
                ) : <></>}
            </Row>
        </Container>
    )

    return (
        <div className="d-flex flex-row">
            {createFilterGroup()}
            { !topLevel ? (
                <CloseButton 
                className="ms-2 align-self-center"
                onClick={deleteFilter}></CloseButton>
            ) : <></>}
        </div>
    )
}

export default FilterGroup