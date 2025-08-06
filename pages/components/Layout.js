import { Container } from 'react-bootstrap';
import Navbar from '../Mainnav';


export default function Layout(props){

    return (
    <>
        <Navbar />
        <br />
        <Container>
        {props.children}
        </Container>
        <br />
    </>
    )
}