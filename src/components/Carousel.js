import Carousel from 'react-bootstrap/Carousel';

function Slider() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100 rounded"
                    src="/images/Carouse1.png"
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100 rounded"
                    src="/images/Carouse2.png"
                    alt="Second slide"
                />
            </Carousel.Item>
        </Carousel>
    );
}

export default Slider;