import axios from "axios";

const url = "/api/persons/";

export async function getPhonebook() {
  const promise = axios({
    method: "get",
    url,
  });

  return promise;
}

export async function addPersonToPhonebook(person) {
  const returnedMessage = {
    messageType: "",
    messageContent: "",
  }

  try {
    const addPersonResponse = await axios({
      method: "post",
      url,
      data: {
        ...person,
      },
    });

    const wasPersonAdded = addPersonResponse.data;

    addPersonResponse.statusText;

    if (wasPersonAdded) {
      returnedMessage.messageType = "success";
      returnedMessage.messageContent = "Added " + person.name;

      return returnedMessage;
    }

    console.log("Person is not found !");


    throw new Error("Person not found!");
  } catch (err) {
    console.log(err);
    returnedMessage.messageType = "error";
    returnedMessage.messageContent = err.message || err;
    return returnedMessage
  } 
}

export async function updatePersonFromPhonebook(person) {
  const returnedMessage = {
    messageType: "",
    messageContent: "",
  }

  try {
    const updatePersonResponse = await axios({
      method: "put",
      url: url + person.id,
      data: {
        ...person,
      },
    });

    const updatedPerson = updatePersonResponse.data;

    if (updatedPerson) {
      returnedMessage.messageType = "success";
      returnedMessage.messageContent = "Updated " + updatedPerson.name;
      return returnedMessage;
    }

    throw new Error();
  } catch (err) {
    returnedMessage.messageType = "error";
    returnedMessage.messageContent = `Information of ${person.name} has already been removed from server!`;
    return returnedMessage;
  } 
}

export async function deletePersonFromPhonebook(personId) {
  const returnedMessage = {
    messageType: "",
    messageContent: "",
  }

  try {
    const deletePersonResponse = await axios({
      method: "delete",
      url: url + personId,
    });

    const deletedPerson = deletePersonResponse.data;

    console.log("deletedPerson", deletedPerson)

    if (deletedPerson) {
      returnedMessage.messageType = "success";
      returnedMessage.messageContent = "Deleted " + deletedPerson.name;
      return returnedMessage;
    }

    throw new Error(deletePersonResponse.data);
  } catch (err) {
    returnedMessage.messageType = "error";
    returnedMessage.messageContent = err.message;
    return returnedMessage;
  } 
}
