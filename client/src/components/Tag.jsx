import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Tag(props) {

  return (
    <div className="d-inline-flex">
      <div className="rounded p-1 me-2 bg-secondary text-white">
        <Link
          className="btn btn-secondary p-1"
          to={`/search/?tag=${props.tag}`}
        >
          {props.tag}
        </Link>
      </div>
    </div>
  )
}

Tag.propTypes = {
  tag: PropTypes.string,
};