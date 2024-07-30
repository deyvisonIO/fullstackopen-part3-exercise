require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

morgan.token("req-body", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});


function errorHandler(err) {
	console.log(err);
	res.status(500).end();
	next();
}

app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body",
  ),
);
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      if (result) {
        res.json(result);
        return;
      }

      res.status(404).end();
    }).catch(err => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  const personToBeAdded = { name, number };

  if (!name) {
    res.status(400);
    res.json({ message: "You need to include a name" });
    return;
  }

  if (!number) {
    res.status(400);
    res.json({ message: "You need to include a number" });
    return;
  }

  Person.find(personToBeAdded).then((result) => {
    if (result.length > 0) {
      res.status(400);
      res.json({ message: "Name must be unique" });
      return;
    } else {
      Person.create(personToBeAdded).then((result) => {
        res.json(result);
        return;
      });
    }
  }).catch(err => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;

  if (!id) {
    res.status(400);
    res.json({ message: "You need to include an id" });
    return;
  }

  if (!name) {
    res.status(400);
    res.json({ message: "You need to include a name" });
    return;
  }

  if (!number) {
    res.status(400);
    res.json({ message: "You need to include a number" });
    return;
  }

  Person.findByIdAndUpdate(id, { name, number }).then((result) => {
    if (!result) {
      res.status(404);
      res.json({ message: "Person not found" });
      return;
    }
    res.json(result);
    return;
  }).catch(err => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).end();
    return;
  }

  Person.findById(id).then((result) => {
    if (!result) {
      res.status(404).end();
      return;
    }

    res.json(result);
  }).catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).end();
    return;
  }

  Person.findByIdAndDelete(id).then((result) => {
    if (!result) {
      res.status(404).end();
      return;
    }
    res.json(result);
  }).catch(err => next(err));
});

app.get("/info", (req, res, next) => {
  const date = new Date();

	Person.countDocuments({}).then(result => {
	  res.write(`<p>Phonebook has info for ${result} people</p>`);
	  res.write(`<p>${date}</p>`);
	  res.end();
	}).catch(err => next(err));
});

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running!"));
