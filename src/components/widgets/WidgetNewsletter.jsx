// react
import React, { useState } from "react";
import { toast } from "react-toastify";
import RestService from "../../store/restService/restService";

function WidgetNewsletter() {
  const [email, setemail] = useState("");
  const handleNewsLetterSubx = () => {
    RestService.subscribeNewsletter({ email: email }).then((res) => {
      toast[res.data.status](res.data.message);
      if (res.data.status === "success") {
        setemail("");
      }
    });
  };

  return (
    <div className="widget-newsletter widget">
      <h4 className="widget-newsletter__title">Our Newsletter</h4>
      <div className="widget-newsletter__text">
        Subscribe to our newsletter for more info and details.
      </div>
      <form className="widget-newsletter__form" onSubmit={(e) => { e.preventDefault(); handleNewsLetterSubx(); }}>
        <label htmlFor="widget-newsletter-email" className="sr-only">
          Email Address
        </label>
        <input
          id="widget-newsletter-email"
          type="email"
          required
          className="form-control"
          placeholder="Email Address"
          onChange={(e) => {
            setemail(e.target.value);
          }}
          value={email || ""}
        />
        <button type="submit" className="btn btn-primary mt-3">
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default WidgetNewsletter;
