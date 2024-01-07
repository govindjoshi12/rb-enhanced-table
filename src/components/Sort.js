import React, { useEffect, useState } from 'react'
import { Container, Row, Col, CloseButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import SortModalRow from './SortModalRow'
import TableButton from './TableButton'
import SearchFields from './SearchFields'
import "./Sort.css"

const newDefaultSortObject = (column) => {
    return {
        sortColumn: column,
        sortDescending: true
    }
}

// orderBy should be an array of objects
// Each object: { sortColumn: {column object} , sortDescending: true }

// orderBy is set "late", so there needs to be a check
function Sort({ size, orderBy, setOrderBy, columns  }) {

    const [localSorts, setLocalSorts] = useState(orderBy)

    // Anytime you derive state from props, you've gotta update it 
    // with a useEffect hook 
    useEffect(() => {
        setLocalSorts(orderBy)
    }, [orderBy])

    // TOD: Remove all currently sorted columns unsortedColumns
    // TODO: ability to change sort directly from a previously made button (i.e., turn it into a dropdown)
    let createSortModalBody = () => (
        <Container>
        <Row>
            <Col><h5>Sort By</h5></Col>
            <Col><h5>Order</h5></Col>
            {/* Hack to get cols aligned */}
            <Col xs="auto"><CloseButton style={{ visibility: "hidden"}} disabled/></Col>
        </Row>
        {localSorts.map((sortObject, index) => (
            <SortModalRow
            key={index}
            sortObject={sortObject}
            sortObjectIndex={index}
            setSorts={setLocalSorts}/>
        ))}
        <hr />
        <Row className="mt-2">
            <Col className="d-flex justify-content-end">
                <SearchFields 
                menuClassName="sort-dropdown-search-fields"
                onFieldClick={(index) => {
                    setLocalSorts(currSorts => {
                        let obj = newDefaultSortObject(columns[index])
                        return [...currSorts, obj]
                    })
                }}
                columns={columns}
                dropdown={true}
                align="end"
                variant="outline-secondary"
                className="mb-2"
                size="sm"
                title="+ Add Sort"/>
            </Col>
        </Row>
        </Container>
    )

    return (
        <TableButton 
        size={size} 
        active={orderBy.length !== 0}
        title={<><FontAwesomeIcon icon={faSort} /> Sort</>}
        modalBody={createSortModalBody()}
        apply={() => setOrderBy([...localSorts])}
        cancel={() => setLocalSorts([...orderBy])} />
    )
}

export default Sort