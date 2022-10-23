import Carousel from 'react-bootstrap/Carousel';

function Slider(props) {
    const { advertisements } = props;
    return (
        <Carousel>
            {advertisements.map((i) => 
                <Carousel.Item>
                    <img className="d-block w-100 rounded" src={i.image} alt={i.alt} />
                </Carousel.Item>)
            }
        </Carousel>
    );
}

export default Slider;