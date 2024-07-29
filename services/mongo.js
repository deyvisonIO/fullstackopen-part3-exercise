const mongoose = require("mongoose");

if(process.argv.length < 3) {
	console.log("give password as an argument!")
	process.exit(1);
}



const password = process.argv[2];

const url = `mongodb+srv://nycdra:${password}@fullstackopen.3qkqjdc.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false);

mongoose.connect(url);



const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Phonebook = mongoose.model('Person', phonebookSchema);


if(process.argv.length === 3) {
	Phonebook.find({}).then(result => {
		console.log("phonebook:");
		result.forEach(phoneEntry => console.log(`${phoneEntry.name} ${phoneEntry.number}`))
		mongoose.connection.close();
	})
}

if(process.argv.length === 5) {
	const name = process.argv[3];
	const number = process.argv[4];
	const newPhonebookEntry = new Phonebook({
		name,
		number,
	})

	newPhonebookEntry.save().then(result => {
		console.log("phonebook entry saved!");
		mongoose.connection.close();
	})
}
