import React, { Component } from "react";
import FooterBottom from "../footer/footer.bottom";
import FooterMiddle from "../footer/footer.middle";
import FooterTop from "../footer/footer.top";
import HeaderMiddle from "../header/header.middle";
class HistoryPurchase extends Component {
  constructor(props) {
    super(props);
    this.state={
      issend:'1'
    }
    this.props.getPurchaseHitory(1)
  }
  caculatorTotalBill = (products) => {
    let total = 0;
    products.map((element, index) => {
      total += element.count * element.price
    })
    return total
  }
  renderBill = () => {
    if(this.state.issend === '1'){
      let count =0;
      let xhtml = this.props.purchaseHistory.map((element, index) => {
          count++;
          return (
            <div className="table-responsive cart_info" style={{marginBottom: "50px"}}>
              
              <span>Date: {new Date(element.date).toDateString("yyyy-MM-dd")}</span>
              <p className='cart_total_price'>Total: {element.total}<sup>đ</sup></p>
              
              <table className="table table-condensed">
                <thead>
                  <tr className="cart_menu">
                    <td className="image">Item</td>
                    <td className="description" />
                    <td className="price">Price</td>
                    <td className="quantity">Quantity</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                {element.books.map((item, index) => {
                  return (
                    <tr>
                    <td className="cart_product">
                      <a href=""><img src={item.urlImage}/></a>
                    </td>
                    <td className="cart_description">
                      <h4>
                        <a>{item.name} </a>
                      </h4>
              
                    </td>
                    <td className="cart_price">
                      <p>{item.price}</p>
                    </td>
                    <td className="cart_quantity">
                      <div className="cart_quantity_button">
                          {item.quantity}
                      </div>
                    </td>
                  </tr>
                  )
                })}
                </tbody>
              </table>
              <div className='login-form'>
                <div className='delete-cart'>
                <button onClick={() => this.props.deleteBill(element.id)} className="destroy btn btn-default">Hủy Đơn Hàng</button>
                </div>
             
              </div>
              <hr/>
            </div>
          )
       
      })
      if(count === 0){
        xhtml = <div className='no-bill'>
        <div className="logo-404">
        <div>
          <div className='null-cart'>
            <img src="/assets/images/home/logo1.gif" alt="" />
            
          </div>
          <h3 className='title'>Không Có Đơn Hàng</h3>
          </div>
          
        </div>
        </div>
      }
      return xhtml;
    }
    
    if(this.state.issend === '2'){
      let count =0;
      let xhtml = this.props.purchaseHistory.map((element, index) => {
          count++;
          return (
            <div className="table-responsive cart_info" style={{marginBottom: "50px"}}>
              
              <span>Date: {new Date(element.date).toDateString("yyyy-MM-dd")}</span>
              <p className='cart_total_price'>Total: {element.total}<sup>đ</sup></p>
              
              <table className="table table-condensed">
                <thead>
                  <tr className="cart_menu">
                    <td className="image">Item</td>
                    <td className="description" />
                    <td className="price">Price</td>
                    <td className="quantity">Quantity</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                {element.books.map((item, index) => {
                  return (
                    <tr>
                    <td className="cart_product">
                      <a href=""><img src={item.urlImage}/></a>
                    </td>
                    <td className="cart_description">
                      <h4>
                        <a>{item.name} </a>
                      </h4>
              
                    </td>
                    <td className="cart_price">
                      <p>{item.price}</p>
                    </td>
                    <td className="cart_quantity">
                      <div className="cart_quantity_button">
                          {item.quantity}
                      </div>
                    </td>
                  </tr>
                  )
                })}
                </tbody>
              </table>
              
              <hr/>
            </div>
          )
       
      })
      if(count === 0){
        xhtml = <div className='no-bill'>
        <div className="logo-404">
        <div>
          <div className='null-cart'>
            <img src="/assets/images/home/logo1.gif" alt="" />
            
          </div>
          <h3 className='title'>Không Có Đơn Hàng</h3>
          </div>
        </div>
        </div>
      }
      return xhtml;
    }

    if(this.state.issend === '3'){
      let count =0;
      let xhtml = this.props.purchaseHistory.map((element, index) => {
          count++;
          return (
            <div className="table-responsive cart_info" style={{marginBottom: "50px"}}>
              
              <span>Date: {element.date.replaceAll("/", "-")}</span>
              <p className='cart_total_price'>Total: {element.total}<sup>đ</sup> </p>
              
              <table className="table table-condensed">
                <thead> 
                  <tr className="cart_menu">
                    <td className="image">Item</td>
                    <td className="description" />
                    <td className="price">Price</td>
                    <td className="quantity">Quantity</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                {element.books.map((item, index) => {
                  return (
                    <tr>
                    <td className="cart_product">
                      <a href=""><img src={item.urlImage}/></a>
                    </td>
                    <td className="cart_description">
                      <h4>
                        <a>{item.name} </a>
                      </h4>
              
                    </td>
                    <td className="cart_price">
                      <p>{item.price}</p>
                    </td>
                    <td className="cart_quantity">
                      <div className="cart_quantity_button">
                        {item.quantity}
                      </div>
                    </td>
                  </tr>
                  )
                })}
                </tbody>
              </table>
              
              <hr/>
            </div>
          )
        
       
      })
      if(count === 0){
        xhtml = <div className='no-bill'>
        <div className="logo-404">
          <div>
          <div className='null-cart'>
            <img src="/assets/images/home/logo1.gif" alt="" />
            
          </div>
          <h3 className='title'>Không Có Đơn Hàng</h3>
          </div>
         
        </div>
        </div>
      }
      return xhtml;
    }

  }
  handleClick1(){
    this.props.getPurchaseHitory(1)
    this.setState({
      issend:'1'
    })
  }
  handleClick2(){
    this.props.getPurchaseHitory(2)
    this.setState({
      issend:'2'
    })
  }
  handleClick3(){
    this.props.getPurchaseHitory(3)
    this.setState({
      issend:'3'
    })
  }
  render() {
    console.log(this.state.issend)
    return (
      <div>
        <header id="header">
          <HeaderMiddle
            islogin={this.props.islogin}
            logout={() => this.props.logout()}
            history={this.props.history}
          />
        </header>
        <div>
          <section id="cart_items">
            <div className="container">
              <div className='bill-title'>
                <h2>Đơn Hàng Của Bạn</h2>
              </div>
              <div className='menu-profile container'>
            <ul>
              <li><button onClick={() => this.handleClick1()} className='menu-custom btn'>Đang Chờ Xử Lý</button></li>
              <li> <button onClick={() => this.handleClick2()}  className='menu-custom btn'>Đang Giao Hàng</button></li>
              <li> <button onClick={() => this.handleClick3()}  className='menu-custom btn'>Đã Giao Hàng</button></li>

            </ul>
              <hr></hr>
            </div>
              {this.renderBill()}
            </div>
          </section>
        </div>
        <footer id="footer">
          <FooterTop />
          <FooterMiddle />
          <FooterBottom />
        </footer>
      </div>
    );
  }
}
export default HistoryPurchase;
