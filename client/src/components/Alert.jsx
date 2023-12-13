import PropTypes from "prop-types";

export default function Alert(props) {


  return (
    <div  style={{zIndex: 9999}}>
      <div className="modal fade" id="alertModal" tabIndex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-danger">
            <div className="modal-body">
              <h1 className="modal-title fs-5 text-white" id="exampleModalLabel">
                {props.alert}
              </h1>
            </div>
            <div className="modal-body text-end">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Got it</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Alert.propTypes = {
  alert: PropTypes.string
};