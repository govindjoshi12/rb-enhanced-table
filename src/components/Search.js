import React, { useEffect, useState } from 'react'
import { InputGroup, Form, Button } from 'react-bootstrap'
import { faSearch, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./Search.css"
import SearchFields from './SearchFields'

function Search({ setSearchQuery, excludedSearchFields, setExcludedSearchFields, columns, size }) {

    const [localQuery, setLocalQuery] = useState("")
    const [localESF, setLocalESF] = useState(excludedSearchFields)

    useEffect(() => {
        setLocalESF(excludedSearchFields)
    }, [excludedSearchFields])

    return (
        <Form
        onSubmit={(event) => {

            event.preventDefault()

            // Only update if there is a new search query
            setSearchQuery(currSearchQuery => {
                if(currSearchQuery !== localQuery)
                    return localQuery

                return currSearchQuery
            })
            setExcludedSearchFields([...localESF])
        }}>
            <InputGroup size={size}>
                <Form.Control
                placeholder="Search..."
                value={localQuery}
                onChange={event => setLocalQuery(event.target.value)}/>

                <SearchFields
                menuClassName="search-dropdown-form"
                size={size}
                onFieldClick={(index) => {
                    setLocalESF(prevESF => {
                        prevESF[index] = !prevESF[index]
                        return [...prevESF]
                    })
                }}
                toggleAll={(bool) => {
                    setLocalESF(prevESF => {
                        return Array(prevESF.length).fill(bool, 0)
                    })
                }}
                columns={columns}
                checkboxes={localESF}
                reverseChecks={true}
                isDisabled={() => false}
                dropdown={true}
                align="end" 
                title="Fields"
                variant="outline-secondary" />
                
                <Button
                type='submit'
                variant="outline-secondary" >
                    <FontAwesomeIcon icon={faSearch} />
                </Button>
                <Button
                variant="outline-secondary"
                onClick={() => {
                    setLocalQuery("")
                    setSearchQuery("")
                }}>
                    <FontAwesomeIcon icon={faArrowsRotate} />
                </Button>
            </InputGroup>
        </Form>
    )
}

export default Search;