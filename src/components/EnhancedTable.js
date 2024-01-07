import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap'
import { faFileCsv, faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Sort from './Sort'
import Pagination from './Pagination'
import Search from './Search'
import Filter from './Filter'
import { newEmptyFilterGroupArray } from './FilterGroup'
import HideFields from './HideFields'
import RawTable from './RawTable'
import TableSettings from './TableSettings'
import TableButton from './TableButton' 

import "./EnhancedTable.css"


// Some Table Defaults

// Table view
const sizes = [
    {
        title: "Compact",
        value: "sm"
    },
    {
        title: "Comfy",
        value: "md"
    }
]

const numRowOptions = [25, 50, 75, 100]
const defaultNumRows = numRowOptions[0]

/* 
    How to use options set by setOptions:
    orderBy: [
        {
            sortColumn: ...,
            sortDescending: ...,
        }
    ],


*/

/*
    @param {array of objects} tableData: table entries
    @param {function} setOptions: set parent's options object
    @param {function} setClickedRow: handle row click
    @param {array of objects} columns: contains metadata about each column
    @param {object} initialOptions: .hiddenFields, .orderBy, .excludeSearchFields, .filters
        all can be undefined
*/
function EnhancedTable(props) {

    let {
        tableData,
        setOptions,
        sendClickedRowId,
        columns,
        initialOptions,
        reset,
        getCsv
    } = props

    // Utiltiy function
    // Hidden Fields and Excluded Search Fields are arrays which contain
    // column titles. Use this data to create a new array which is 
    // of size columns.length, and each index in the array corresponds
    // to the column in columns at that index. 
    const refactorArray = useCallback((inputArray, hiddenFieldsCheck) => {
        let arr = Array(columns.length).fill(false, 0)

        if(inputArray) {
            columns.forEach((element, index) => {
                if(inputArray.includes(element.title)) {
                    arr[index] = true
                }
            })
        }

        // More important than passed in inputArray
        if(hiddenFieldsCheck) {
            columns.forEach((element, index) => {
                // column objects contain only of these fields, or none of them
                if(element.alwaysShow) {
                    arr[index] = false
                } 
                if(element.alwaysHide) {
                    arr[index] = true
                }
            })
        }

        return arr;
    }, [columns])


    // General Table
    const [selectedRowIndex, selectRowIndex] = useState(null)
    const [tableSize, setTableSize] = useState(sizes[0])
    const [showSearchRow, setShowSearchRow] = useState(false)

    // TODO: 
    // States for table icons and sticky ID column
    // ... yeahhh maybe later

    // Hidden Fields
    const [hiddenFields, setHiddenFields] = useState(refactorArray(initialOptions.hiddenFields, true))

    // Sorting
    const [orderBy, setOrderBy] = useState(initialOptions.orderBy || [])

    // Search
    const [searchQuery, setSearchQuery] = useState(initialOptions.searchQuery || "")
    const [excludedSearchFields, setExcludedSearchFields] = useState(refactorArray(initialOptions.excludedSearchFields))

    // Filters
    const [filters, setFilters] = useState(initialOptions.filters || newEmptyFilterGroupArray())

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(defaultNumRows)

    // Whenever incoming initial options change, it means our own options need to be updated
    // columns doesn't need to be changed because the prop itself is used throughout.
    useEffect(() => {
        // Things left out that don't need to change
        // tableSize, showSearchRow

        // Copying all the initial states from above.... 
        // is there a better way to do this?

        selectRowIndex(null)
        
        setHiddenFields(refactorArray(initialOptions.hiddenFields, true))
        
        setOrderBy(initialOptions.orderBy || [])
        
        setSearchQuery(initialOptions.searchQuery || "")
        setExcludedSearchFields(refactorArray(initialOptions.excludedSearchFields))
        
        setFilters(initialOptions.filters || newEmptyFilterGroupArray())
        
        setRowsPerPage(defaultNumRows)
        setCurrentPage(1)

    }, [initialOptions, refactorArray]) 

    // Reset to page one whenever sorts or filters change
    useEffect(() => {
        setCurrentPage(1)
        setRowsPerPage(numRowOptions[0])
    }, [orderBy, filters, searchQuery])

    // Use provided prop setOptions whenever inner options change, caused by this component
    useEffect(() => {

        // Hidden fields is all front end
        // excludeInSearch

        // Could send just accessors here, but deciding
        // to send whole column and let parent take care of it
        let sendESF = []
        columns.forEach((column, index) => {
            if(excludedSearchFields[index]) {
                sendESF.push(column)
            }
        })

        let currentOptions = {
            orderBy: orderBy,
            filters: filters,
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
            searchQuery: searchQuery,
            excludedSearchFields: sendESF,
        }

        setOptions({...currentOptions})

        // Including initialOptions so that setOptions is called anytime the
        // table options in the parent component are updated
    }, [orderBy, filters, rowsPerPage, currentPage, searchQuery, excludedSearchFields, columns, setOptions, initialOptions])

    // Dynamically create title
    const createTitle = () => {
        return (
            <h4 className='mb-0 align-self-end'>{initialOptions.title}</h4>
        )
    }

    return (
        <Container fluid className="custom-table-container h-100 mt-1">
            <Row className="mb-1 gx-1">
                <Col>{createTitle()}</Col>
                <Col xs="auto">
                    <Button onClick={reset} variant="outline-danger" size={tableSize.value}>
                        <FontAwesomeIcon icon={faRefresh}/> Reset
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button onClick={getCsv} variant="outline-success" size={tableSize.value} disabled={getCsv === undefined}>
                        <FontAwesomeIcon icon={faFileCsv} />
                    </Button>
                </Col>
            </Row>
            <Row className="mb-1 gx-1">
                <Col>
                    {/* All others get tableSize.value, but this gets tableSize for controlling it */}
                    <TableSettings
                    size={tableSize}
                    setTableSize={setTableSize}
                    sizes={sizes} />
                </Col>
                <Col>
                    <Sort
                    size={tableSize.value}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    columns={columns} />
                </Col>
                <Col>
                    <Filter 
                    size={tableSize.value}
                    filters={filters}
                    setFilters={setFilters}
                    columns={columns} />
                </Col>
                <Col >
                    <HideFields 
                    size={tableSize.value}
                    hiddenFields={hiddenFields}
                    setHiddenFields={setHiddenFields}
                    columns={columns} />
                </Col>
                <Col>
                    <TableButton
                    onClick={() => setShowSearchRow(!showSearchRow)}
                    active={showSearchRow}
                    size={tableSize.value}
                    title={<><FontAwesomeIcon icon={faSearch} /> Search</>} />
                </Col>
            </Row>
            { showSearchRow ? (
            <Row className='gx-0 mb-1'>
                <Col className="pe-1">
                    <Search 
                    setSearchQuery={setSearchQuery}
                    columns={columns} 
                    excludedSearchFields={excludedSearchFields}
                    setExcludedSearchFields={setExcludedSearchFields}
                    size={tableSize.value} />
                </Col>
            </Row>
            ) : <></>}
            <Row className="mb-1">
                <Col>
                    <RawTable 
                        columns={columns}
                        tableData={tableData}
                        hiddenFields={hiddenFields}
                        selectedRowIndex={selectedRowIndex}
                        selectRowIndex={selectRowIndex}
                        sendClickedRowId={sendClickedRowId}
                        size={tableSize.value}
                    />
                    <Pagination
                        className="pagination gx-0 py-1"
                        currentPage={currentPage}
                        setPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        metadata={tableData ? tableData.metadata : null}
                        options={numRowOptions}
                        size={tableSize.value}/>
                </Col>
            </Row>
        </Container>
    )
}

export default EnhancedTable;