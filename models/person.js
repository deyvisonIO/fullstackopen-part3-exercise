const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;

if(!url) {
	console.log("url doesn't exists")
	process.exit(1);
}

mongoose.connect(url)
	.then(() => {
		console.log("database connected!")
	})
	.catch(error => {
		console.log("error connecting to database:", error.message)
	});


const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

mongoose.set("toJSON", {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model('Person', personSchema)
