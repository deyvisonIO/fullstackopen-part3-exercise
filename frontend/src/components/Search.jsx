export function Search({ newSearch, handleSearch }) {
	return (
		<input value={newSearch} onChange={handleSearch} />
	)
}
