// react
import React, { Component } from "react";

// third-party
import { Helmet } from "react-helmet";

// application
import Pagination from "../shared/Pagination";

// data stubs
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
import Currency from "../shared/Currency";
import "./orders.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { Modal } from "reactstrap";

class AccountPageOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      selected: "order",
      headers: {},
      page: 1,
      open: false,
      orderProducts: [],
    };
  }

  componentDidMount() {
    this.handleGetOrders(1, 15, this.props.customer.customerId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected !== this.state.selected) {
      this.handleGetOrders(1, 15, this.props.customer.customerId);
    }
  }

  handleGetOrders = (page, pageSize = 15) => {
    if (this.state.selected === "order") {
      RestService.getOrderByCustomerId(
        page,
        pageSize,
        this.props.customer.customerId
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
          console.log(response, "asdasdasaaaaa");

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
                items: item.orderLines,
                total: <Currency value={item.orderAmountWithTaxAndDiscount} />,
              });
            });
          this.setState({
            orders: data,
          });
        }
      });
    } else if (this.state.selected === "saleOrder") {
      RestService.getSaleOrderByCustomerId(
        page,
        pageSize,
        this.props.customer.customerId
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

    this.handleGetOrders(page, 15, this.props.customer.customerId);
  };

  handleSwitch = (val) => {
    this.setState({ selected: val });
  };

  handleItemView = (items) => {
    items = items || [];
    this.setState({ open: true, orderProducts: items });
  };
  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const { page, orders, orderProducts } = this.state;

    const ordersList = orders.map((order) => (
      <tr key={order.id}>
        <td>{`#${order.orderId}`}</td>
        <td>{order.date}</td>
        <td>
          <p
            onClick={() => this.handleItemView(order.items)}
            className="items-cell"
          >
            {order.items.length} items
          </p>
        </td>
        <td>{order.status}</td>
        <td>{order.total}</td>
        {this.state.selected === "order" ? (
          true || moment().diff(moment(new Date(order.date)), "hours") < 24 ? (
            <td>
              <Link
                to={`/store/paynow/checkout/${order.orderId}`}
                className="btn btn-outline-success"
                type="button"
              >
                <i>Pay Now</i>
              </Link>
            </td>
          ) : (
            <td>
              <Link
                to={""}
                className="btn btn-outline-danger disabled"
                disabled
                type="button"
              >
                <i>Expired</i>
              </Link>
            </td>
          )
        ) : null}
      </tr>
    ));

    const ordersItemsList = orderProducts.map((item) => (
      <tr key={item.productId}>
        <td>{item.productName}</td>
        <td>{item.lineTotal}</td>
      </tr>
    ));

    return (
      <div className="card">
        <Helmet>
          <title>{`Your Orders — ${theme.name}`}</title>
        </Helmet>

        <Modal
          isOpen={this.state.open}
          toggle={() => this.handleToggle()}
          centered
          size="lg"
        >
          <div
            className="container"
            style={{
              minWidth: "300px",
              minHeight: "300px",
              overflowY: "scroll",
            }}
          >
            <div className="card-divider" />
            <div className="card-table p-4">
              <div
                style={{
                  marginBottom: 10,
                  borderBottom: "2px solid lightgray",
                }}
                className="w-100"
              >
                <h4 className="text-center">Order Items</h4>
              </div>
              <div className="table-responsive-sm">
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersItemsList.length > 0 ? (
                      ordersItemsList
                    ) : (
                      <tr>
                        <td className="text-left font-weight-bold">No product found.</td>
                        <td className="text-left font-weight-bold">£0</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>

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
                  <th>Items</th>
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

const mapStateToProps = ({ auth }) => ({
  customer: auth.profile,
});

export default connect(mapStateToProps)(AccountPageOrders);
