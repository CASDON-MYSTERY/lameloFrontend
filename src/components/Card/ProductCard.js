import React, { useEffect, useState, useContext } from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import {
    Card, CardImg, CardText,
    CardBody, CardTitle, Row,
    Col, Container, Alert
} from 'reactstrap';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import numbro from 'numbro';
import { storeContext, addToCart, load, LOADING } from '../State/State';

const animatedComponents = makeAnimated();


const ProductCard = ({ products, prices }) => {

    const [DivDisplay, setDivdisplay] = useState({ display: false, check: false })
    const [priceState, setpriceState] = useState([])
    let check = false;




    // useEffect(() => {
    // }, [Display]);
    const { storestate, storedispatch } = useContext(storeContext)
    const initial = { display: false, check: false }
    const filter = (array, price) => {
        let items = []
        array.forEach(id => {
            let [match] = price.filter(price => id == price.id)
            items.push(match)
        })
        return items
    }

    const spliter = (id) => {
        let array = id.split("-")
        let [priceID, productId] = array
        return { priceID: parseInt(priceID), productId: parseInt(productId) }
    }


    const decisionBox = <div className="decisionBox">
        <p>Choose either to continue shopping or to view your shopping cart by checking out</p>
        <button onClick={() => { setDivdisplay(initial) }}>Continue Shopping</button>
        <NavLink to="/ShoppingCart"><button>Check Out</button> </NavLink>
    </div>
    const alreadyInCart = <div className="decisionBox" >
        <p style={{ color: "red", marginLeft: "50px" }}>Item already in Cart</p>
        <button onClick={() => { setDivdisplay(initial) }}>Continue Shopping</button>
        <NavLink to="/ShoppingCart"><button>Check Out</button> </NavLink>
    </div>


    const onChange = (e) => {
        // const { priceID, productId } = spliter(e.target.id)
        let value = []
        let stateArry = []
        try {
            value = e.map(item => item.value)
        } catch (err) {
        }
        setpriceState([])
        value.forEach(item => {
            console.log(priceState)
            let [price] = prices.filter(x => x.id == item)
            // console.log(price)
            // price = e.target.value
            // let [rest] = prices.filter(x => x.id != item)
            // let check = priceState.filter(item => item.id == price.id)
            let check = stateArry.filter(item => item.id == price.id)
            if (check.length == 0) {
                // setpriceState([...priceState, price])
                stateArry.push(price)
                setpriceState(stateArry)
            }
        })
    }
    console.log(priceState)
    const onClick = (e) => {
        const id = e.target.id
        console.log(id)
        let [product] = products.filter(product => product.id == id)
        let check = false;
        if (product.multipleSIzes.length > 0) {
            if (priceState.length > 0) {
                setDivdisplay({ display: true })
                // let filtered = priceState.filter(x => x.checked == true)
                for (const index of priceState) {
                    const data = { id: parseInt(`${product.id}${index.id}`), Id: product.id, name: product.name, brand: product.brand, price: index.price, size: index.size, quantity: 1, image: product.image }
                    storestate.cart.forEach(x => {
                        if (x.id == data.id) {
                            check = true
                            setDivdisplay({ display: true, check: true })
                        }
                    })
                    if (check != true) {
                        storedispatch(addToCart(data))
                    }

                }
            }
        } else if (product.multipleSIzes.length == 0) {
            setDivdisplay({ display: true })
            storestate.cart.forEach(x => {
                if (x.id == id) {
                    check = true
                    setDivdisplay({ display: true, check: true })
                }
            })
            if (check != true) {
                const data = { id: product.id, Id: product.id, name: product.name, brand: product.brand, price: product.price, quantity: 1, image: product.image }
                storedispatch(addToCart(data))
            }
        }
    }

    return (
        <Container>
            <Row>
                {
                    (products && products.length > 0) ? products.map((pizza, index) => (
                        // const options = [
                        //     { value: 'chocolate', label: 'Chocolate' },
                        //     { value: 'strawberry', label: 'Strawberry' },
                        //     { value: 'vanilla', label: 'Vanilla' }
                        //   ]


                        <Col lg="4" key={index}>
                            <Card className="card-container">
                                <CardImg top width="95%" src={pizza.image} alt={`pizza-image-${pizza.image}`} height={200} />
                                <CardBody>
                                    <CardTitle><h3>{pizza.name}</h3></CardTitle>

                                    {pizza.price === 0 && prices.length > 0 ?
                                        <>
                                            <Select closeMenuOnSelect={false} components={animatedComponents} onChange={onChange} placeholder="Select Product Sizes..." isMulti options={filter(pizza.multipleSIzes, prices).map((item) => ({ value: item.id, label: `Size:${item.size}- ₦${numbro(parseInt(item.price)).format({ thousandSeparated: true })}` }))
                                            } /><br /></>
                                        : <p><b>Price:</b> <span>₦{numbro(parseInt(pizza.price)).format({ thousandSeparated: true })}</span></p>}
                                    <CardText style={{ "color": "black" }}>{pizza.description}</CardText>
                                </CardBody>
                            </Card>
                            <div>
                                <button id={pizza.id} className="button-cart" onClick={onClick}>ADD TO CART</button>
                                {DivDisplay.check && DivDisplay.display ? alreadyInCart : DivDisplay.display ? decisionBox : ""}
                            </div>
                        </Col>
                    )) : <Alert>Failed to load items</Alert>
                }

            </Row>
        </Container>
    );
};

export default ProductCard;
