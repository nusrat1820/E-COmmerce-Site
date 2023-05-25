import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  ButtonToolbar,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
  Span,
  h4,
  h6,
  svg,
} from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.sellPrice * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      //const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement("script");
      script.type = "text/javascript";
      // script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true;
      /* script.onload = () => {
        setSdkReady(true)
      } */
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);

    if (window.confirm("TransactionID and Bkash Number Is OK?"))
      dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h2>Chef Looks</h2>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                {/*                 <strong>Mobile Number: {order.shippingAddress.phone}</strong>{' '} */}
                {/*                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                 <a href={`mailto:${order.user.phone}`}>{order.user.phone}</a>  */}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}
                {/* , {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country},{' '} */}
                <br />
                <strong>Mobile Number: </strong>
                {order.shippingAddress.mobileNumber}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid && order.paymentMethod === "Bkash" ? (
                <>
                  <Message variant="success">Paid on {order.paidAt}</Message>
                  <h2>Given Bkash Number Is : {order.bkashNumber}</h2>
                  <h2>Given Transaction ID Is : {order.transactionId}</h2>
                </>
              ) : order.paymentMethod === "Bkash" ? (
                <>
                  <Message variant="danger">Not Paid</Message>
                </>
              ) : (
                "You choose Cash On delivery"
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.sellPrice} = $
                          {item.qty * item.sellPrice}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            {order.paymentMethod === "Bkash" ? (
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {
                      /* !sdkReady ? (
                    <Loader />
                  ) : */ <>
                        <span style={{ fontSize: 25 }}>
                          If you have done anything wrong, call this number
                          (01883637195)
                        </span>
                        <br />
                        <br />
                        <span style={{ fontSize: 25 }} className="text-danger">
                          I typed the bKash number and transaction ID correctly,
                          and checked well. The family market is not responsible
                          for any of my mistakes.
                        </span>

                        <br />
                        <br />
                        <span style={{ fontSize: 25 }}>
                          All my information is correct, I will now confirm the
                          payment by clicking on the button below.{" "}
                        </span>

                        <br />
                        <br />
                        <Button onClick={successPaymentHandler}>
                          Payment Confirm
                        </Button>
                      </>
                    }
                  </ListGroup.Item>
                )}
                {loadingDeliver && <Loader />}
                {userInfo &&
                userInfo.isAdmin &&
                order.isPaid & !order.isDelivered ? (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                ) : null}
              </ListGroup>
            ) : (
              <>
                {userInfo && userInfo.isAdmin && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
                <br />
                <span style={{ fontSize: 15 }}>
                  Your order came to us successfully, we are yours soon We will
                  contact and we will come to you with the product.
                </span>
                <br />
                <span className="text-danger" style={{ fontSize: 20 }}>
                  You can contact us at this number to know any information or
                  report any problem : 01883637195
                </span>
              </>
            )}
          </Card>
        </Col>
      </Row>
      <Button
        onClick={() => {
          window.print();
        }}
      >
        Print
      </Button>
    </>
  );
};

export default OrderScreen;
