// react
import React, { Component } from "react";

// third-party
import { Helmet } from "react-helmet";

// application
import Pagination from "../shared/Pagination";

// data stubs
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
import { ConstCustomerId } from "../../constant/constants";
import Currency from "../shared/Currency";
import "./orders.css";
import { Link } from "react-router-dom";

export default class AccountPageOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      selected: "order",
      headers: {},
      page: 1,
    };
  }

  componentDidMount() {
    this.handleGetOrders(1, 15, ConstCustomerId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected !== this.state.selected) {
      this.handleGetOrders(1, 15, ConstCustomerId);
    }
  }

  handleGetOrders = (page, pageSize = 15, ConstCustomerId) => {
    if (this.state.selected === "order") {
      RestService.getOrderByCustomerId(page, pageSize, ConstCustomerId).then(
        (r) => {
          if (r.data.status === "success") {
            let data = [];
            let response = r.data.data;

            console.log(JSON.parse(r.headers["x-pagination"]));

            this.setState({ headers: JSON.parse(r.headers["x-pagination"]) });
            response.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.orderDate) - new Date(a.orderDate);
            });

            response.length > 0 &&
              response.map((item) => {
                data.push({
                  orderId: item.orderId,
                  date: item.orderDate
                    ? new Date(item.orderDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Invalid date",
                  status: item.orderStatusName,
                  items: item.orderLines.length,
                  total: (
                    <Currency value={item.orderAmountWithTaxAndDiscount} />
                  ),
                });
              });
            this.setState({
              orders: data,
            });
          }
        }
      );
    } else if (this.state.selected === "saleOrder") {
      RestService.getSaleOrderByCustomerId(
        page,
        pageSize,
        ConstCustomerId
      ).then((r) => {
        if (r.data.status === "success") {
          let data = [];
          let response = r.data.data;
          this.setState({ headers: JSON.parse(r.headers["x-pagination"]) });

          response.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.orderDate) - new Date(a.orderDate);
          });

          response.length > 0 &&
            response.map((item) => {
              data.push({
                orderId: item.saleOrderId,
                date: item.saleOrderDate
                  ? new Date(item.saleOrderDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Invalid date",
                status: item.orderStatusName,
                items: item.saleOrderLines.length,
                total: (
                  <Currency value={item.saleOrderAmountWithTaxAndDiscount} />
                ),
              });
            });
          this.setState({
            orders: data,
          });
          if (r.data.status === "success") {
          }
        }
      });
    }
  };

  handlePageChange = (page) => {
    this.setState(() => ({ page }));

    this.handleGetOrders(page, 15, ConstCustomerId);
  };

  handleSwitch = (val) => {
    this.setState({ selected: val });
  };

  render() {
    const { page, orders } = this.state;

    const ordersList = orders.map((order) => (
      <tr key={order.id}>
        <td>{`#${order.orderId}`}</td>
        <td>{order.date}</td>
        <td>{order.status}</td>
        <td>{order.total}</td>
        {this.state.selected === "order" ? (
          <td>
            <Link to={""} className="btn btn-outline-success" type="button">
              <i>Pay Now</i>
            </Link>
          </td>
        ) : null}
      </tr>
    ));

    return (
      <div className="card">
        <Helmet>
          <title>{`Your Orders — ${theme.name}`}</title>
        </Helmet>

        <div className="card-header">
          <div className="row">
            <div className="col-md-12">
              <h5>Your Orders</h5>

              <div className="col-md-12 pl-0">
                <div className="d-inline-flex mt-3">
                  <span
                    onClick={() => this.handleSwitch("order")}
                    className="mr-4 p-1 pointer"
                  >
                    <p
                      className={
                        this.state.selected === "order"
                          ? "selected mb-0"
                          : "mb-0"
                      }
                    >
                      Pending Orders
                    </p>
                  </span>

                  <span
                    onClick={() => this.handleSwitch("saleOrder")}
                    className="mr-4 p-1 pointer"
                  >
                    <p
                      className={
                        this.state.selected === "saleOrder"
                          ? "selected mb-0"
                          : "mb-0"
                      }
                    >
                      Completed Orders
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-divider" />
        <div className="card-table">
          <div className="table-responsive-sm">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{ordersList}</tbody>
            </table>
          </div>
        </div>
        <div className="card-divider" />
        <div className="card-footer">
          <Pagination
            current={page}
            total={this.state.headers.totalPages}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
