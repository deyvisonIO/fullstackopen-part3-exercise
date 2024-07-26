import { useEffect, useState } from 'react'
import { Persons } from './components/Persons'
import { Form } from './components/Form'
import { Search } from './components/Search'
import { addPersonToPhonebook, deletePersonFromPhonebook, getPhonebook, updatePersonFromPhonebook } from './services/phonebook';
import { Message } from './components/Message';

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState({
    type: "hidden",
    content: "",
  })

  useEffect(() => {
    const getPhonebookResponse = getPhonebook();

    getPhonebookResponse.then(response => setPersons(response.data));
  }, []);

  function changeMessage(type, content) {
    setMessage({
      type,
      content,
    })

    setTimeout(() => setMessage({
      type: "hidden",
      content: ""
    }), 5000);
  }


  async function handleSubmit(e) {
    e.preventDefault();

    const isPersonOnPhoneBook = persons.some(person => newName === person.name);

    if (isPersonOnPhoneBook && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)) {
      const person = persons.filter(person => person.name === newName)[0];
      const newPerson = {
        ...person,
        number: newNumber,
      }
      const { messageContent, messageType } = await updatePersonFromPhonebook(newPerson)

      if (messageType === "success") {
        setPersons(prevPersons => prevPersons.map(prevPerson => prevPerson.id === newPerson.id ? newPerson : prevPerson))
      }

      changeMessage(messageType, messageContent)

      return;
    }

    const newPerson = {
      id: crypto.randomUUID(),
      name: newName,
      number: newNumber
    }
    const { messageContent, messageType } = await addPersonToPhonebook(newPerson)
    console.log(messageContent)
    console.log(messageType)

    if (messageType === "success") {
      setPersons(prev => {
        const newPersonArr = prev.concat(newPerson);
        return newPersonArr;
      })
    }


    changeMessage(messageType, messageContent)
  }

  function handleSearch(e) {
    const search = e.target.value;

    setNewSearch(search)
  }

  async function handlePersonDeletion(id, name) {
    if (!window.confirm("Delete " + name + " ?")) return;
    const personsFiltered = persons.filter(person => person.id !== id);

    const { messageContent, messageType } = await deletePersonFromPhonebook(id);

    if (messageType === "success") {
      setPersons(personsFiltered)
    }

    changeMessage(messageType, messageContent)

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message type={message.type} content={message.content} />
      <Search newSearch={newSearch} handleSearch={handleSearch} />
      <Form handleSubmit={handleSubmit} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Persons persons={persons} newSearch={newSearch} handlePersonDeletion={handlePersonDeletion} />
    </div>
  )
}

export default App
