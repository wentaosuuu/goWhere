import React, {memo} from "react";
import './Ticket.css';
import PropTypes from 'prop-types';

const Ticket = memo(function Ticket(props) {
  const{type, price,}=props;

  return(
    <div className="ticket">
      <p>
        <span className="ticket-type">{type}</span>
        <span className="ticket-price">{price}</span>
      </p>
      <div className="label">坐席</div>
    </div>
  );
});

Ticket.propTypes={
  type: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  price:PropTypes.string.isRequired,
};

export default Ticket;
