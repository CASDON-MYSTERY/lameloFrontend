import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import numbro from 'numbro';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Card, Button } from 'reactstrap';

import Pagination from '../Pagination/Pagination';

// import './Dashboard.css'
import { ThemeContext } from '../Context/ThemeContext';

import { storeContext, performAction, GET_ORDERED, getHours } from '../../components/State/State';

const NotificationList = (props) => {
    const products = props.products
    const theme = useContext(ThemeContext);
    const { isLightTheme, light, dark } = theme;
    const checkTheme = isLightTheme ? light: dark;
    const [pageOfItems, setPageOfItems] = useState([]);

    const { storestate, storedispatch } = useContext(storeContext);
    const { customers } = storestate
    const filterCustomers = (array, customerId) => {
        let [match] = array.filter(customer => customer.id == customerId)
        return match.fullName
    }

    const onclick = (e) => {
        const [id, action] = e.target.id.split("-")
        // console.log(id)
        const data = { "action": action, "data": id, "customer": "", "search": "" }
        const config = { headers: { "Content-Type": "application/json", "Authorization": `Token ${storestate.AdminUser.token}` } }

        const decisionBox = () => toast.success(<div className="decisionBox">
            <p>{action == "Delivered" ? `Are you sure you want to mark order with id: ${id} as delivered` :
                `Are you sure you want to send order with id: ${id} to Archives`}</p><br />
            <div className="btns-checkout">
                <Button onClick={() => { performAction(data, GET_ORDERED, config).then(res => storedispatch(res)) }} color="success">Yes</Button>
                <Button color="info">No</Button>
            </div>
        </div>, {
            position: "top-center",
            autoClose: 50000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        decisionBox()
    }
    const list = pageOfItems && pageOfItems.length > 0 ? pageOfItems.map(items => (
        <tr key={items.id} role="row" className="dashboard-order">
            <td className="dashboard-td" role="cell"><NavLink style={{color: checkTheme.syntax }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}> {items.OrderId}</NavLink> </td>
            <td className="dashboard-td" role="cell"><NavLink style={{color: checkTheme.syntax  }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}> {filterCustomers(customers, items.customer)}</NavLink> </td>
            <td className="dashboard-td" role="cell"><NavLink style={{color: checkTheme.syntax  }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}> &#x20A6; {numbro(items.total).format({ thousandSeparated: true })}</NavLink></td>
            <td className="dashboard-td" role="cell">{items.destination === 'null' ? "" : items.destination === 'iwpk' ? <NavLink style={{color: checkTheme.syntax  }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>Customer Pickup</NavLink> : <NavLink style={{color: checkTheme.syntax }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>{items.destination}</NavLink>}</td>
            <td className="dashboard-td" role="cell">{ items.logistics === 0 ? "" : <NavLink style={{color: checkTheme.syntax  }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>&#x20A6;{numbro(items.logistics).format({ thousandSeparated: true })}</NavLink>}</td>
            <td className="dashboard-td" role="cell"><NavLink style={{color: checkTheme.syntax  }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>&#x20A6;{numbro(items.logistics + items.total).format({ thousandSeparated: true })}</NavLink></td>
            <td className="dashboard-td" role="cell"> <NavLink style={{ color: checkTheme.syntax }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>{items.created.slice(0, 11)}
            </NavLink><br />
                <NavLink style={{ color: checkTheme.syntax }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>{
                    getHours(items.created.slice(12))
                }
            </NavLink></td>
            <td className="dashboard-td" role="cell"> <NavLink style={{color: checkTheme.syntax  }} to={`/ordered/${items.id}/${items.total}/${items.customer}/${items.destination}`}>{items.delivered ? "Delivered" : "Not Delivered"}</NavLink></td>
            <td className="dashboard-td" role="cell">{items.delivered ? "" : <Button id={`${items.OrderId}-Delivered`} style={{marginRight: "5px"}} onClick={onclick}>Delivered?</Button>}
            {items.archived ? "" : <Button id={`${items.OrderId}-Archive`} onClick={onclick}>Archive</Button>}</td>
        </tr>
    )): <tr className="text-center" colSpan="9">No Orders Yet</tr>

    const onChangePage = (pageOfItems) => {
        setPageOfItems(pageOfItems);
    }

    return (

        <Container className="dashboard-container">

            {isLightTheme ?
                <Card style={{ backgroundColor: checkTheme.cardHeader }}>

                    <h3 style={{ textAlign: 'center', fontSize: '30px', backgroundColor: checkTheme.cardHeader }}>
                        New Orders
                       </h3>
                    <table className="table table-striped dashboard-table" role="table">
                        <thead role="rowgroup" className="table-heading">
                            <tr role="row" className="heading-row">
                                <th role="columnheader">Ref No:</th>
                                <th role="columnheader">Customer</th>
                                <th role="columnheader">Amount</th>
                                <th role="columnheader">Destination</th>
                                <th role="columnheader">Logistics </th>
                                <th role="columnheader">Total</th>
                                <th role="columnheader">Date ordered</th>
                                <th role="columnheader">Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody role="rowgroup" className="dashboard-tbody">
                            {list}

                        </tbody>
                      </table>
                      {products && products.length > 0 ? (
                        <Pagination items={products} onChangePage={onChangePage} />) : null
                      }
                    </Card>: 
                    <Card style={{ backgroundColor: checkTheme.cardHeader }}>
                      
                     <h3 style={{textAlign: 'center', fontSize:'30px', backgroundColor: checkTheme.cardHeader}}>
                        New Orders
                     </h3>
                    <table className="table table-striped table-dark dashboard-table" role="table">
                        <thead role="rowgroup" className="table-heading">
                            <tr role="row" className="heading-row">
                                <th role="columnheader" className="dashboard-th">Ref No:</th>
                                <th role="columnheader" className="dashboard-th">Customer</th>
                                <th role="columnheader" className="dashboard-th">Amount</th>
                                <th role="columnheader" className="dashboard-th">Destination</th>
                                <th role="columnheader" className="dashboard-th">Logistics </th>
                                <th role="columnheader" className="dashboard-th">Total</th>
                                <th role="columnheader" className="dashboard-th">Date ordered</th>
                                <th role="columnheader" className="dashboard-th">Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody role="rowgroup" className="dashboard-tbody">
                            {list}
                        </tbody>
                    </table>
                    {products && products.length > 0 ? (
                        <Pagination items={products} onChangePage={onChangePage} />) : null
                      }
                    </Card>}
                    <ToastContainer position="top-center"
                        autoClose={10000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </Container> 
        
    );
};


export default NotificationList;