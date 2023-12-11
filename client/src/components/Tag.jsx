import PropTypes from "prop-types";

export default function Tag(props) { 

  return (
    <div
      className="me-2"
    >
      {props.tag}
    </div>
  )
}

Tag.propTypes = {
  tag: PropTypes.shape({
    tag: PropTypes.string,
  }),
};