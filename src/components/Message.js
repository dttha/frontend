import Alert from 'react-bootstrap/Alert'

export default function Message(props) {
    return (
        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
    )
}