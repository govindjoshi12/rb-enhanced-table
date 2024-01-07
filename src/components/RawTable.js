import React from "react";
import { Table } from "react-bootstrap";
import CustomTd from "./CustomTd";
import Loading from "../Loading";
import "./RawTable.css"

// We assume that first column is ID field. Sticky it. 

// stackoverflow post:
// it is only safe to use array indices as keys for arrays that are guaranteed to be static
// any arrays that get filtered, reordered, etc. must use some unique separate key prop
// Why? idk... Not fixing this right now but TODO for fixing all my maps/forEachs etc.
const RawTable = ({ 
    columns, 
    tableData,
    hiddenFields,
    selectedRowIndex,
    sendClickedRowId,
    selectRowIndex,
    size
}) => {
    // Create Headers, separated so that headers stay intact when only rows are updated
    let createTableHeaders = () => {
        
        let headers = []

        columns.forEach((column, index) => {

            if(!hiddenFields[index]) {
                headers.push(
                    <th 
                    key={column.title}
                    className={index === 0 ? "sticky-id-col" : ""}>
                        {column.title}
                    </th>
                )
            }

        })

        return (<thead><tr>{headers}</tr></thead>)
    }

    // Create table entries
    let createTableEntries = () => {
        // tableData must have a dataArray and metadata field
        return (
            <tbody>
            {tableData.dataArray.map((row, rowIndex) => {
                // Select row
                let highlight = selectedRowIndex === rowIndex

                // We established convention that columns arrays first 
                // column is the id column.
                let clickHandler = () => {
                    selectRowIndex(rowIndex)
                    sendClickedRowId(row[columns[0].accessor])
                }

                // Populate row 

                let rowEntries = []
                columns.forEach((column, colIndex) => {
                    if(!hiddenFields[colIndex]) {
                        let element = row[column.accessor]

                        // If element has a link attribute, turn it into a link
                        // @TODO need to alter the way this works

                        // Removing links for now
                        // if(column.link !== undefined) {
                        //     element = (
                        //         <Link to={`/${column.link}/${element}`}>
                        //             {element}
                        //         </Link>
                        //     )
                        // }

                        rowEntries.push(
                            <CustomTd 
                            key={colIndex}
                            className={colIndex === 0 ? `sticky-id-col ${highlight ? "highlighted-element" : ""}` : ""}>
                                {element}
                            </CustomTd>
                        )
                    }
                })
                
                return (
                    <tr 
                    key={rowIndex} 
                    className={highlight ? "highlighted-element" : ""} 
                    onClick={clickHandler}>
                        {rowEntries}
                    </tr>
                )
            })}
            </tbody>
        )
    }

    return (
        <div className='table-container'>
            <Table size={size} bordered hover id="custom-table">
                {createTableHeaders()}
                {!tableData ? <></> : <>{createTableEntries()}</>}
            </Table>
            {!tableData ? <Loading /> : <></>}
        </div>
    )
}

export default RawTable