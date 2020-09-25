import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { storeContext, processOrder, load, LOADING, LOADED } from "../State/State";
import { Redirect } from 'react-router-dom';


const Details = (props) => {
    const { storestate, storedispatch } = useContext(storeContext);
    const { cart, User, success } = storestate
    const { user } = User

    useEffect(() => {
        storedispatch(load(LOADED))
    }, []);

    const initialState = user != undefined ? {
        full_name: user.full_name, email: user.email, phone_number: user.phone_number, address: ""
    } : {}
    const initialErrorState = {
        full_name: false, phone_number: false, email: false, phoneNumLength: false
    }
    const [formstate, setFormstate] = useState(initialState);
    const [errorstate, setErrorstate] = useState(initialErrorState);
    const { full_name, phone_number, email, address } = formstate;
    let errorTest = {
        "name": /[^a-z\s]/i,
        "phone_number": /[^0-9+\s]/i,
        "email": /^[a-z]+\d*[a-z]*@[a-z]+\.\w+\s*$/gi,
    }


    const onChange = (e) => {
        setFormstate({ ...formstate, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault();
        let total = 0
        let products = []
        const date = Date.now().toString().slice(5)
        const random = Math.floor(Math.random() * 100)
        const OrderId = `#${random}${date}`

        for (const product of cart) {
            let amount = product.price * product.quantity
            total += amount
            products.push({
                "name": product.name, "quantity": product.quantity, "price": product.price,
                "size": product.size != undefined ? product.size : "", "flavour": product.flavour, "product": product.Id
            })
        }
        const { full_name, phone_number, email, address } = formstate;
        const phone = errorTest.phone_number.test(phone_number)
        const fullName = errorTest.name.test(full_name)
        const Email = !errorTest.email.test(email)
        const phoneNumLength = phone_number.length < 11
        const data = JSON.stringify({
            user: { "fullName": full_name, "phoneNumber": phone_number, email, address },
            Ordered: { OrderId, total }, OrderedProduct: products
        })
        const config = { headers: { "Content-Type": "application/json" } }

        setErrorstate(initialErrorState)
        if (!fullName && !phone && !Email && !phoneNumLength) {
            processOrder(data, config).then(res => storedispatch(res))
            storedispatch(load(LOADING))
        }
        setErrorstate({ full_name: fullName, phone_number: phone, email: Email, phoneNumLength });

    }
    // if (User == "") {
    //     return < Redirect to="/login" />
    // }user-details
    if (storestate.success) {
        return < Redirect to="/pay" />
    }
    return (
            <div className="user-details-container">
                <h2 className="user-info-title"><center>PROVIDE YOUR DELIVERY DETAILS</center></h2><br />
            <Form action="" method="post" onSubmit={onSubmit} className="user-detail-input">
            
                <FormGroup>
                  <Label for="full_name">FULL NAME</Label>
                  {errorstate.full_name ? <p className="error">Only alphabets are allowed</p> : ""}
                 <Input type="text" name="full_name" value={full_name} id="full_name" onChange={onChange} placeholder="Please Enter Your last name" required />
                </FormGroup>
                <FormGroup>
                  <Label for="email">EMAIL</Label>
                  {errorstate.email ? <p className="error">Invalid Email</p> : ""}
                 <Input type="email" name="email" value={email} id="email" onChange={onChange} placeholder="Please Enter Your Email" required />
                </FormGroup>
                <FormGroup>
                  <Label for="phone_number">PHONE NUMBER</Label>
                  {errorstate.phone_number ? <p className="error">Only digits/numbers are allowed</p> : errorstate.phoneNumLength ? <p className="error">Phone Number should not be less than 11 digits </p> : ""}
                <Input type="text" name="phone_number" value={phone_number} id="phone_number" onChange={onChange} placeholder="Please Enter Your phone number" required />
                </FormGroup>
                <FormGroup>
                  <Label for="address">ADDRESS</Label>
                  <Input type="address" name="address" value={address} id="address" onChange={onChange} placeholder="Please Enter Your address" required />
                </FormGroup>
               
               
                <Button className='submitButton btn-lg' color="primary" type="submit">SUBMIT</Button>
            </Form>
            </div>
    );

};


export default Details;

