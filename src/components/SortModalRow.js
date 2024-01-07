import React, { useCallback } from 'react'
import { Row, Col, CloseButton, DropdownButton, Dropdown } from 'react-bootstrap'
// import { faArrowRightLong, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Parent Modal will contain bootstrap container

// TODO: Click current column, see dropdown of other cols and can change
// sortDescending, same thing, can change it with dropdown

// TODO: Change descending output based on field type (text: A->Z, Z->A)
const SortModalRow = ({ sortObject, sortObjectIndex, setSorts }) => {
    
    const updateSortDescending = useCallback((bool) => {
        // THe right way to set state on an object property inside an array of objects
        setSorts(currSortObjects => (
            currSortObjects.map((currSortObject, currSortObjectIndex) => {
                if(currSortObjectIndex === sortObjectIndex) {
                    return {...currSortObject, sortDescending: bool}
                }

                return currSortObject
            })   
        ))
    }, [setSorts, sortObjectIndex])

    const removeSortObject = useCallback(() => {

        setSorts(currSortObjects => (
            currSortObjects.filter((currSortObject, currSortObjectIndex) => (
                currSortObjectIndex !== sortObjectIndex
            ))
        ))

    }, [setSorts, sortObjectIndex])

    return (
        <Row className="mb-2">
            <Col className="d-flex align-items-center">
                {sortObject.sortColumn.title}
            </Col>
            <Col>
                <DropdownButton
                size="sm"
                variant="outline-secondary" 
                title={sortObject.sortDescending ? <>Descending</> : <>Ascending</>}>
                    <Dropdown.Item 
                    active={!sortObject.sortDescending}
                    onClick={() => {
                        updateSortDescending(false)
                    }}>
                        Ascending
                    </Dropdown.Item>

                    <Dropdown.Item 
                    active={sortObject.sortDescending}
                    onClick={() => {
                        updateSortDescending(true)
                    }}>
                        Descending
                    </Dropdown.Item>
                </DropdownButton>
            </Col>
            <Col xs="auto">
                <CloseButton onClick={removeSortObject}  />
            </Col>
        </Row>
    )
}

export default SortModalRow