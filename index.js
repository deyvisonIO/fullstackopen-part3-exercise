const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token("req-body", function(req, res) {
	if(req.method === 'POST') return JSON.stringify(req.body);
	return "";
})

app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))
app.use(express.json());
app.use(express.static("dist"))


app.get("/api/persons", (req, res) => {
	res.json(people);
})


app.post("/api/persons", (req, res) => {
	const { id, name, number } = req.body;


	if(!id) {
		res.status(400);
		res.json({ message: "You need to include a name"})
		return;
	}

	if(!name) {
		res.status(400);
		res.json({ message: "You need to include a name"})
		return;
	}

	if(!number) {
		res.status(400);
		res.json({ message: "You need to include a number"})
		return;
	}

	if(people.some(person => person.name === name)) {
		res.status(400);
		res.json({ message: "Name must be unique"})
		return;
	}

	people.push({
		id,
		name,
		number,
	});

	res.json({ id, name, number });
})


app.put("/api/persons/:id", (req, res) => {
	const id = req.params.id;
	const { name, number } = req.body;


	if(!id) {
		res.status(400);
		res.json({ message: "You need to include an id"})
		return;
	}

	const personExists = people.some(person => person.id === id)

	if(!personExists) {
		res.status(400);
		res.json({ message: "You need to include an id"})
		return;
		
	}

	if(!name) {
		res.status(400);
		res.json({ message: "You need to include a name"})
		return;
	}

	if(!number) {
		res.status(400);
		res.json({ message: "You need to include a number"})
		return;
	}
	

	people = people.map(person => person.id === id ? { id, name, number} : person);

	res.json({ id, name, number });
})


app.get("/api/persons/:id", (req, res) => {
	const id = req.params.id

	if(!id) {
		res.status(400).end();
		return;
	}

	const person = people.find(person => person.id === id);

	if(!person) {
		res.status(404).end();
		return;
	}

	res.json(person);
})

app.delete("/api/persons/:id", (req, res) => {
	const id = req.params.id

	if(!id) {
		res.status(400).end();
		return;
	}

	const person = people.find(person => person.id === id);

	console.log("person:", person);
	console.log("people:", people);

	if(!person) {
		res.status(404).end();
		return;
	}

	people = people.filter(person => person.id !== id);


	res.json(person);
})

app.get("/info", (req, res) => {
	const date = new Date();
	const length = people.length;
	

	res.write(`<p>Phonebook has info for ${length} people</p>`);
	res.write(`<p>${date}</p>`)
	res.end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running!"))
