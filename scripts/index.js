"use strict"

$(function () {
  // menu on small screens
  $(".navbar-menu-button").on("click", () => {
    $(".navbar-nav").toggleClass("menu-open");
    $(".navbar-nav .nav-item").toggleClass("menu-open");
  });
  //////

  let goodsCount = 0;
  let $goodsCountElement = $(".goods-count");

  let $cart = $(".cart");

  $(".cart-img").on("click", () => {
    if (goodsCount > 0) {
      $("#cart-modal").modal();
      $cart.css("display", "grid");
      $(".total-price").css("display", "initial");
    } else {
      $("#empty-cart-modal").modal();
    }
  });

  let goodsInCart = [];

  $(".card-buy").on("click", (event) => {
    $goodsCountElement.text(++goodsCount);
    $(".cart-img").css("right", ($goodsCountElement.width() + 10).toString() + "px");

    let $goods = $(event.currentTarget).parent().parent();
    let goodsName = $goods.children().eq(1).children(":first").children(":first").text();
    let goodsPrice = $goods.children().eq(1).children().eq(1).children(":first").text();
    goodsPrice = parseInt(goodsPrice);
    console.log(goodsPrice);

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
      $goods.children().last().children().last().remove();
      $goods.append(`
      <div class='cart-item-count-setter'>
        <img src="./img/minus.png" alt="-" class="cart-item-dec-count">
        <span class="cart-item-count">1</span>
        <img src="./img/plus.png" alt="+" class="cart-item-inc-count">
      </div>`);
      $cart.append($goods);
    } else {
      updateCountInCart(goodsName, count)
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

    $(".total-price").text(totalPrice.toString());
  };

  function updateCountInCart(goodsName, count) {
    let $countElem = $cart.find(".card .card-body .card-title-link:contains(" + goodsName + ")").parent().parent().parent().children(".cart-item-count-setter");
    $countElem.children().eq(1).text(count.toString());
  }

  // function deleteFromCart()

  $cart.on("click", ".cart-item-inc-count", (event) => {
    let goodsName = $(event.currentTarget).parent().siblings().eq(1).children(":first").children(":first").text();

    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        if (++goodsInCart[i].count === 0) {
          goodsInCart.splice(i, 1)
        } else {
          updateCountInCart(goodsName, goodsInCart[i].count);
        }
        break;
      }
    }
  });

  $cart.on("click", ".cart-item-dec-count", (event) => {
    let goodsName = $(event.currentTarget).parent().siblings().eq(1).children(":first").children(":first").text();

    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        if (--goodsInCart[i].count === 0) {
          goodsInCart.splice(i, 1)
        } else {
          updateCountInCart(goodsName, goodsInCart[i].count);
        }
        break;
      }
    }
  });
});


