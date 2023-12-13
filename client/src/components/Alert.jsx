import PropTypes from "prop-types";

export default function Alert(props) {

  

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal fade" id="alertModal" tabIndex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
        <div className={`${props.centered ? "modal-dialog modal-dialog-centered" : "modal-dialog"}`}>
          <div className="modal-content">
            <div className="modal-body custom-modal-body">
              <h1 className="modal-title text-white text-center fs-5" id="exampleModalLabel">
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
  alert: PropTypes.string,
  centered: PropTypes.bool,
};