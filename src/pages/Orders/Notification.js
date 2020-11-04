import React, { useContext, useEffect, useState } from 'react';
import { storeContext, getOrder, ADD_NOTIFICATION } from '../../components/State/State';
import { ThemeContext } from '../Context/ThemeContext';
import { NavLink } from 'react-router-dom';

const Notifications = () => {
    const { storestate, storedispatch } = useContext(storeContext);
    const [ display, setDisplay ] = useState(false)
    const { Orders, archive, notification } = storestate;

    const theme = useContext(ThemeContext);
    const { isLightTheme, light, dark } = theme;
    const checkTheme = isLightTheme ? light: dark;

    useEffect(() => {
        const joined = Orders.concat(archive)
        const orderCheckInterval = setInterval(() => {
            getOrder().then(res => {
                let newOrder = []
                res.data.forEach(element => {
                    const check = joined.filter(item => item.id == element.id)
                    if (check.length == 0) {
                        newOrder.push(element)
                    }
                });
                if (newOrder.length > 0) {
                    const data = {
                        type: ADD_NOTIFICATION,
                        neworder: newOrder,
                        data: res.data,
                        customers: res.customers
                    }
                    storedispatch(data)
                    setDisplay(true)
                }
            })
        }, 60000);
        return () => clearInterval(orderCheckInterval)
    }, [Orders]);

    return (
        <> 
         
            {notification.length}
            <div className={display ? "notify" : "notify hide-notification"}>
                <div className="box-items">
                <h3 ><NavLink to="/admin/orders" >You have a new order</NavLink></h3>
                </div>
            </div> 
        </>
    );
};




export default Notifications;