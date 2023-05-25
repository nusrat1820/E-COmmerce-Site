import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MessengerCustomerChat from 'react-messenger-customer-chat';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col  className='text-center py-3' style={{fontFamily: 'Atma'}}>Copyright &copy; Chef Looks |  Developed by Borna</Col>
          
        </Row>

      </Container>
      <MessengerCustomerChat
          pageId="657482318195296"
          appId="808416489743589"
  />
    </footer>
  )
}

export default Footer
