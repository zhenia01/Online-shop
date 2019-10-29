"use strict"

import './scss/style.scss'
import './scss/menu.scss'
import $ from "jquery"
import "jquery-modal"
import "jquery-modal/jquery.modal.min.css"

$(function () {
  $(".navbar-menu-button").on("click", () => {
    $(".navbar-nav").toggleClass("menu-open");
    $(".navbar-nav .nav-item").toggleClass("menu-open");
  });

  let goodsInCart = [];
  let goodsCount = 0;
  let $goodsCountElement = $(".goods-count");

  let $cart = $(".cart");

  $(".cart-img").on("click", () => {
    if (goodsCount > 0) {
      $("#cart-modal").modal();
      $cart.css("display", "grid");
      $(".total-price").css("display", "inline-block");
      $(".cart-buy").css("display", "inline-block");
    } else {
      $("#empty-cart-modal").modal();
    }
  });

  function setGoodsCount(value) {
    goodsCount += value;
    $goodsCountElement.text(goodsCount.toString());
    $(".cart-img").css("right", ($goodsCountElement.width() + 10).toString() + "px");
  }


  $(".card-buy").on("click", (event) => {
    setGoodsCount(1);

    let $goods = $(event.currentTarget).parent().parent();
    let goodsName = $goods.find(".card-title").text();
    let goodsPrice = $goods.find(".item-price").text();
    goodsPrice = parseInt(goodsPrice);

    let isInCart = false;
    let count = 1;

    for (let i of goodsInCart) {
      if (i.name === goodsName) {
        isInCart = true;
        count = ++i.count;
        break;
      }
    }

    if (!isInCart) {
      goodsInCart.push({
        name: goodsName,
        count: 1,
        price: goodsPrice
      })

      $goods = $goods.clone();
      $goods.find('.card-buy').remove();
      $goods.append(`
      <img src="./img/trash.png" alt="trash" class="cart-item-delete">
      <div class='cart-item-count-setter'>
        <img src="./img/minus.png" alt="-" class="cart-item-dec-count">
        <div class="cart-item-count">1</div>
        <img src="./img/plus.png" alt="+" class="cart-item-inc-count">
      </div>`);
      $cart.append($goods);
    } else {
      updateCountInCart($cart.find(".card").has(`.card-body .card-title-link:contains(${goodsName})`), count)
    }

    countTotalPrice(goodsInCart)
  });

  function countTotalPrice() {
    let totalPrice = 0;

    for (let i of goodsInCart) {
      if ("price" in i) {
        totalPrice += i.price * i.count;
      }
    }

    $(".total-price").text("Total price: " + totalPrice.toString() + " грн");
  }

  function updateCountInCart($goods, count) {
    $goods.find(".cart-item-count").text(count.toString());
  }

  function deleteFromCart($goods, index) {
    goodsInCart.splice(index, 1)
    $goods.remove();

    if (goodsInCart.length === 0) {
      $.modal.close();
      $("#empty-cart-modal").modal();
    }
  }

  $cart.on("click", ".cart-item-inc-count", (event) => {
    let $goods = $(event.currentTarget).parent().parent();
    let goodsName = $goods.find('.card-title').text();

    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        setGoodsCount(1);
        updateCountInCart($goods, ++goodsInCart[i].count);
        countTotalPrice();
        break;
      }
    }
  });

  $cart.on("click", ".cart-item-dec-count", (event) => {
    let $goods = $(event.currentTarget).parent().parent();
    let goodsName = $goods.find('.card-title').text();

    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        setGoodsCount(-1);
        if (--goodsInCart[i].count === 0) {
          deleteFromCart($goods, i)
        } else {
          updateCountInCart($goods, goodsInCart[i].count);
        }
        countTotalPrice();
        break;
      }
    }
  });

  $cart.on("click", ".cart-item-delete", (event) => {
    let $goods = $(event.currentTarget).parent();
    let goodsName = $goods.find('.card-title').text();
    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        setGoodsCount(-goodsInCart[i].count);
        deleteFromCart($goods, i)
        countTotalPrice();
        break;
      }
    }
  });
});
