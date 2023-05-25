import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";

const PlaceOrderScreen = ({ history }) => {
  const [bkashNumber, setBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.sellPrice * item.qty, 0)
  );
  const income = addDecimals(
    cart.cartItems.reduce(
      (acc, item) =>
        acc + (item.sellPrice * item.qty - item.buyPrice * item.qty),
      0
    )
  );
  /*   cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2))) */
  cart.totalPrice = Number(cart.itemsPrice) /* +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice) */
    .toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [history, success]);
  const submitHandler = (e) => {
    e.preventDefault();
  };

  const placeOrderHandler = () => {
    if (
      bkashNumber === "" &&
      transactionId === "" &&
      cart.paymentMethod === "Bkash"
    ) {
      alert("Please Enter Bkash No. and Transaction ID");
    } else {
      dispatch(
        createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          transactionId,
          bkashNumber,
          income,
        })
      );
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address},{" "}
                {/* {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country},{' '} */}
                <strong>Mobile Number:</strong>
                {cart.shippingAddress.mobileNumber}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method:{cart.paymentMethod} </strong>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
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
          {cart.paymentMethod === "Bkash" ? (
            <ListGroup>
              <h4 style={{ fontSize: 20 }}>Bkash Number: </h4>
              <ListGroup.Item>
                <span style={{ fontSize: 15 }}> (Merchant Account)</span>

                <h4> 01308543768</h4>
              </ListGroup.Item>
              <h4>Rules of payment: </h4>
              <ListGroup.Item>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>
                  *247# Dial or go to bKash Mobile App.
                </span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>

                <span style={{ fontSize: 15 }}>Select the payment option.</span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>
                  Write our Bkash merchant number: 01308543768.{" "}
                </span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>Amount of money:</span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>Reference: Your name</span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>Counter number: 1</span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>
                  Complete the payment with your PIN number
                </span>
                <br />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
                <span style={{ fontSize: 15 }}>
                  Fill in the form from which you developed and the transaction
                  ID / TrxID in the form on the right side.
                </span>
              </ListGroup.Item>
            </ListGroup>
          ) : (
            " "
          )}
        </Col>
        <Col md={4}>
          <Card>
            {cart.paymentMethod === "Bkash" ? (
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${/* {cart.shippingPrice} */}0</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${/* {cart.taxPrice} */}0</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {error && <Message variant="danger">{error}</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h1>Fill out this form</h1>
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="address">
                      <Form.Label
                        style={({ fontSize: 25 }, { fontWeight: "bold" })}
                      >
                        Bkash No.
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Bkash No."
                        value={bkashNumber}
                        required
                        onChange={(e) => setBkashNumber(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="address">
                      <Form.Label
                        style={({ fontSize: 25 }, { fontWeight: "bold" })}
                      >
                        Transaction ID
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Transaction ID"
                        value={transactionId}
                        required
                        onChange={(e) => setTransactionId(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <span className="text-danger" style={{ fontSize: 20 }}>
                      Once again, verify the bKash number and transaction ID.
                      Chef Looks is not responsible if you have difficulty
                      getting the goods due to your misinformation.
                    </span>
                    <br />
                    <span style={{ fontSize: 20 }}>
                      Press the button below
                    </span>

                    {/*                       <Button type='submit' onClick={successPaymentHandler} >
                      Confirm Order
          
                    </Button> */}
                  </Form>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Send Bkash & TransactionID
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            ) : (
              <>
                <span style={{ fontSize: 20 }}>
                  You Choose Cash On Delivery.
                </span>
                <span style={{ fontSize: 16 }}>
                  Click on the button below to go to the next step.
                </span>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Go To Next Step
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
