export function Persons({ persons, handlePersonDeletion, newSearch }) {
	const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

	return (
		<div >
			{filteredPersons.map(person => (
				<p key={person.id} >
					{person.name} {person.number}
					<button onClick={() => handlePersonDeletion(person.id, person.name)}>delete</button>
				</p>
			))
			}
		</div >
	)
}
