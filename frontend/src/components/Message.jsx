export function Message({ type, content }) {
	return (
		<div className={`message ${type}`}>{content}</div>
	)
}
