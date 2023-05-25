import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Circle from "../components/Circle";

const ShellbeTest = () => {
  const [number, setNumber] = useState(0);
  const [circle, setCircle] = useState([]);

  const counter = () => {
    setNumber(number + 1);
    circle.push(<Circle />);

    console.log(circle.length);
  };

  return (
    <div>
      <Button onClick={counter}>Make Circle</Button>
      <h1> Circle {number}</h1>
      <Row>
        {circle.map((element, index) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <Circle />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShellbeTest;
