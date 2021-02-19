// react
import React, { Component } from "react";

// application
import departmentsArea from "../../services/departmentsArea";
import DepartmentsLinks from "./DepartmentsLinks";
import { Menu18x14Svg, ArrowRoundedDown9x6Svg } from "../../svg";
import { Link } from "react-router-dom";

class Departments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      fixed: false,
      area: null,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick);

    this.unsubscribeAria = departmentsArea.subscribe((area) => {
      this.setState({
        fixed: !!area,
        // fixed: false,
        area,
      });
    });

    this.setState({
      fixed: !!departmentsArea.area,
      // fixed: false,
      area: departmentsArea.area,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { fixed, area, open } = this.state;

    if (prevState.fixed !== fixed) {
      const root = this.wrapperRef;
      const content = root.querySelector(".departments__links-wrapper");

      if (fixed) {
        const areaRect = area.getBoundingClientRect();
        const areaBottom = areaRect.top + areaRect.height + window.scrollY;

        root.classList.remove("departments--transition");
        root.classList.add("departments--fixed", "departments--opened");

        const height =
          areaBottom - (content.getBoundingClientRect().top + window.scrollY);

        content.style.height = `${height}px`;
        content.getBoundingClientRect(); // force reflow
      } else {
        root.classList.remove("departments--opened", "departments--fixed");
        content.style.height = "";
      }
    } else if (!fixed) {
      if (open) {
        const root = this.wrapperRef;

        const content = root.querySelector(".departments__links-wrapper");
        content.getBoundingClientRect(); // force reflow
        const startHeight = content.getBoundingClientRect().height;

        root.classList.add("departments--transition", "departments--opened");

        const endHeight = content.getBoundingClientRect().height;

        content.style.height = `${startHeight}px`;
        content.getBoundingClientRect(); // force reflow
        content.style.height = `${endHeight}px`;
      } else {
        const root = this.wrapperRef;
        const content = root.querySelector(".departments__links-wrapper");
        const startHeight = content.getBoundingClientRect().height;

        content.style.height = `${startHeight}px`;

        root.classList.add("departments--transition");
        root.classList.remove("departments--opened");

        content.getBoundingClientRect(); // force reflow
        content.style.height = "";
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick);

    this.unsubscribeAria();
  }

  unsubscribeAria = () => {};

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleOutsideClick = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState(() => ({
        open: false,
      }));
    }
  };

  handleButtonClick = (cond) => {
    this.setState(
      (state) => ({
        open: !state.open,
      }),
      () => {
        if (cond === "yes") {
          if (this.state.open) {
            this.props.history.push("/store");
          } else {
            this.props.history.push("/");
          }
        }
      }
    );
  };

  handleTransitionEnd = (event) => {
    if (this.wrapperRef && event.propertyName === "height") {
      this.wrapperRef.querySelector(
        ".departments__links-wrapper"
      ).style.height = "";
      this.wrapperRef.classList.remove("departments--transition");
    }
  };

  render() {
    return (
      <div className="departments" ref={this.setWrapperRef}>
        <div className="departments__body">
          <div
          style={{height: '410.017px'}}
            className="departments__links-wrapper"
            onTransitionEnd={this.handleTransitionEnd}
          >
            <DepartmentsLinks handleButtonClick={this.handleButtonClick} />
          </div>
        </div>
        <button
          type="button"
          className="departments__button"
          onMouseEnter={() => this.handleButtonClick("no")}
          onClick={() => this.handleButtonClick("yes")}
        >
          <Menu18x14Svg className="departments__button-icon" />
          Online Shop
          <ArrowRoundedDown9x6Svg className="departments__button-arrow" />
        </button>
      </div>
    );
  }
}

export default Departments;
