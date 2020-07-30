import React, { useState, useEffect } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import Axios from "axios";
import AddBtn from "../components/AddButton"

function Books() {
  // Setting our component's initial state
  const [books, setBooks] = useState([])
  const [formObject, setFormObject] = useState({})
  const [results, setResults] = useState([])

  // Load all books and store them with setBooks
  useEffect(() => {
    loadBooks()
  }, [])

  // Loads all books and sets them to books
  function loadBooks() {
    API.getBooks()
      .then(res => 
        setBooks(res.data)
      )
      .catch(err => console.log(err));
  };

  // Deletes a book from the database with a given id, then reloads books from the db
  function deleteBook(id) {
    API.deleteBook(id)
      .then(res => loadBooks())
      .catch(err => console.log(err));
  }

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({...formObject, [name]: value})
  };

  function saveGBook(book){
    API.saveBook({
      title: book.title,
      author: book.authors,
      synopsis: book.description,
      link: book.linkInfo
    })
  }

  // When the form is submitted, use the API.saveBook method to save the book data
  // Then reload books from the database
  function handleFormSubmit(event) {
    event.preventDefault();
    Axios.get(`https://www.googleapis.com/books/v1/volumes?q=${formObject.search}`)
    .then(({data}) =>{
      console.log(data.items)
      setResults(data.items
        
       )
    }
    )
  };

    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            
              <h1>Google Books</h1>
          
            <form>
              <Input
                onChange={handleInputChange}
                name="search"
                placeholder="Search "
              />
            
              <FormBtn
                disabled={!(formObject.search )}
                onClick={handleFormSubmit}
              >
                Go
              </FormBtn>
            </form>
            <Jumbotron>
              <h1>Results</h1>
            </Jumbotron>
            
              <List>
                {results.map(({volumeInfo}) => (
                  <ListItem >
                    <a href={volumeInfo.infoLink}>
                      <strong>
                        {volumeInfo.title}
                      </strong>
                    </a>
                    
                    <AddBtn onClick={() => saveGBook(volumeInfo)} />
                  </ListItem>
                ))}
              </List>
          </Col>
          <Col size="md-6 sm-12">
            
            
          </Col>
        </Row>
      </Container>
    );
  }


export default Books;
