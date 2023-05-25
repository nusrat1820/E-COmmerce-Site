import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";

const Category = ({ history }) => {
  /*   const [keyword, setKeyword] = useState('') */

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  // unique category selecting
  let categoryList;
  if (products) {
    categoryList = [...new Set(products.map((it) => it.category))];
  }

  const clickHandler = (e) => {
    e.preventDefault();

    /*         console.log(keyword) */

    //taking value from the list
    console.log(e.target.text);
    const ch = e.target.text;

    if (ch.trim()) {
      history.push(`/search/${ch}`);
    } else {
      history.push("/");
    }
  };

  return (
    <>
      {/*     <Form onSubmit={submitHandler} inline>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
        Search
      </Button>
    </Form> */}

      <Dropdown className="margin-left-10 ct_drop">
        <Dropdown.Toggle
          className="ct_button"
          style={{ fontSize: 15 }}
          id="dropdown-basic-button"
        >
        CATEGORY
        </Dropdown.Toggle>

        <Dropdown.Menu className="drop_menu">
          {categoryList && categoryList.map((product, index) => (
            <Dropdown.Item
              key={index}
              style={{ fontSize: 13 }}
              className="drop_text"
              type="text"
              onClick={clickHandler}
              value={product.category}
            >
              {product}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Category;
