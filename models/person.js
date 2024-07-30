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
	name: {
		type: String,
		minLength: 3,
		required: [true, "name required!"],
	},
	number: {
		type: String,
		validate: {
			validator: function(str) {
				return /\d{2,3}-\d+/.test(str)
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		required: [true, "number required!"],
	},
});

mongoose.set("toJSON", {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model('Person', personSchema)
