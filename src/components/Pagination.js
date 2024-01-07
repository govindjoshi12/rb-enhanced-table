import React from 'react'
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Pagination.css"
import Loading from '../Loading';

// Need to reset this stuff anytime search or filter or etc.
// is done in table. Also need a way to reset everything to
// defaults to in table

function Pagination(props) {

    let { 
        className,
        currentPage,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        metadata,
        options,
        size }  = props

    let currentNumRows = () => {
        if(metadata.currentPageRows < rowsPerPage) {
            return metadata.currentPageRows
        } else {
            return rowsPerPage
        }
    }

    let createOptions = () => {
        let rowPerPageVals = []

        if(metadata.totalNumRows < options[0]) {
            rowsPerPage = metadata.totalNumRows
            rowPerPageVals.push(metadata.totalNumRows)
        } else {
            // simple sorted insert
            for(let i = 0; i < options.length; i++) {
                if(options[i] >= metadata.totalNumRows)
                    break;
                rowPerPageVals.push(options[i])
            }
        }

        let dropdownOptions = rowPerPageVals.map((item, index) => (
            <Dropdown.Item
                key={index}
                onClick={() => {
                    if(item !== 0 || item === rowsPerPage) {
                        // Don't waste a fetch/render on useless op
                        setRowsPerPage(item)
                        setPage(1)
                    }
                }}
                active={item === rowsPerPage}>
                {item}
            </Dropdown.Item>
        ))

        return dropdownOptions
    }

    return (
        <Container>
        <Row className={className}>
            <Col className="pag-left">
                <Button
                    size={size} 
                    variant="outline-secondary"
                    onClick={() => {setPage(1)}}
                    disabled={!metadata || currentPage === 1}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                &nbsp;
                <Button
                    size={size} 
                    variant="outline-secondary"
                    onClick={() => {setPage(currentPage - 1)}}
                    disabled={!metadata || currentPage === 1}>
                    <FontAwesomeIcon icon={faChevronLeft} /> 
                </Button>
            </Col>
            
            { metadata ? (
                <>
                    <Col className="pag-mid">
                        Pg. {currentPage} of {metadata.lastPage}
                    </Col>
                    <Col className="pag-mid">
                        <DropdownButton 
                            size={size} 
                            drop="up" 
                            variant="outline-secondary" 
                            title={currentNumRows()}>
                            {createOptions()}
                        </DropdownButton>
                        &nbsp;of {metadata.totalNumRows}
                    </Col>
                </>
            ) : (
                <Col xs={6}>
                    <Loading />
                </Col>
            )}
            <Col className="pag-right">
                <Button
                    size={size} 
                    variant="outline-secondary"
                    onClick={() => {setPage(currentPage + 1)}}
                    disabled={!metadata || currentPage === metadata.lastPage}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
                &nbsp;
                <Button 
                    size={size} 
                    variant="outline-secondary"
                    onClick={() => {setPage(metadata.lastPage)}}
                    disabled={!metadata || currentPage === metadata.lastPage}>
                    <FontAwesomeIcon icon={faChevronRight} />
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
            </Col>
        </Row>
        </Container>
    )
}

export default Pagination;