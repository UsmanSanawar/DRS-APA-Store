// react
import React, { useState } from "react";

// third-party
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import CartIndicator from "./IndicatorCart";
import Departments from "./Departments";
import Indicator from "./Indicator";
import NavLinks from "./NavLinks";
import { Heart20Svg, LogoSmallSvg } from "../../svg";
import RestService from '../../store/restService/restService';
import { Spinner } from 'reactstrap';

function NavPanel(props) {
  const { layout, wishlist } = props;


  const [userLoad, setUserLoad] = useState(false);


  let logo = null;
  let departments = null;
  let searchIndicator;

  departments = (
    <div className="nav-panel__departments">
      <Departments {...props} />
    </div>
  );

  return (
    <div
      className="nav-panel"
      style={props.layout === "compact" ? { backgroundColor: "#f1630cab" } : {}}
    >
      <div className="nav-panel__container container">
        <div className="nav-panel__row">
          {logo}
          {departments}

          <div className="nav-panel__nav-links nav-links">
            <NavLinks layout={props.layout} history={props.history} />
          </div>

          <div className="nav-panel__indicators">
            <Indicator
              url="/store/wishlist"
              value={wishlist.length}
              icon={<Heart20Svg />}
            />

            <Indicator
              onClick={async () => {
                let token = JSON.parse(localStorage.getItem('token'));
                if (token) {
                  setUserLoad(true)
                  RestService.getCustomerByToken(token).then(res => {
                    setUserLoad(false)
                    if (res.data.status === "success") {
                      return props.history.push('/store/dashboard')
                    }
                  }).catch(err => {

                    setUserLoad(false)

                    if (err) {
                      localStorage.removeItem('token');
                      localStorage.removeItem('identity');
                      return props.history.push('/store/login')
                    }
                  });
                } else {
                  localStorage.removeItem('token');
                  localStorage.removeItem('identity');
                  return props.history.push('/store/login')
                }
              }}
              icon={userLoad ?
                <Spinner style={{ height: 20, width: 20, color: "#f6965c" }} />
                : <i style={{ fontSize: 20 }} className="fa fa-user" />}
            />

            <CartIndicator />
          </div>
        </div>
      </div>
    </div>
  );
}

NavPanel.propTypes = {
  /** one of ['default', 'compact'] (default: 'default') */
  layout: PropTypes.oneOf(["default", "compact"]),
};

NavPanel.defaultProps = {
  layout: "default",
};

const mapStateToProps = (state) => ({
  wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavPanel);
