"use strict"

$(function () {
  // menu on small screens
  $(".navbar-menu-button").on("click", () => {
    $(".navbar-nav").toggleClass("menu-open");
    $(".navbar-nav .nav-item").toggleClass("menu-open");
  });
  //////

  let goodsInCart = [];
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

  function setGoodsCount(isInc) {
    $goodsCountElement.text((isInc ? ++goodsCount : --goodsCount).toString());
    $(".cart-img").css("right", ($goodsCountElement.width() + 10).toString() + "px");
  }


  $(".card-buy").on("click", (event) => {
    setGoodsCount(true);

    let $goods = $(event.currentTarget).parent().parent();
    let goodsName = $goods.find(".card-title").text();
    let goodsPrice = $goods.find(".item-price").text();
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
      $goods.find('.card-buy').remove();
      $goods.append(`
      <div class='cart-item-count-setter'>
        <img src="./img/minus.png" alt="-" class="cart-item-dec-count">
        <div class="cart-item-count">1</div>
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
  }

  function updateCountInCart(goodsName, count) {
    let $countElem = $cart.find(".card .card-body .card-title-link:contains(" + goodsName + ")").parent().parent().parent().children(".cart-item-count-setter");
    $countElem.find('.cart-item-count').text(count.toString());
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
    let $goods =  $(event.currentTarget).parent().parent();
    let goodsName = $goods.find('.card-title').text();

    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        setGoodsCount(true);
        updateCountInCart(goodsName, ++goodsInCart[i].count);
        countTotalPrice();
        break;
      }
    }
  });

  $cart.on("click", ".cart-item-dec-count", (event) => {
    let $goods =  $(event.currentTarget).parent().parent();
    let goodsName = $goods.find('.card-title').text();

    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].name === goodsName) {
        setGoodsCount(false);
        if (--goodsInCart[i].count === 0) {
          deleteFromCart($goods, i)
        } else {
          updateCountInCart(goodsName, goodsInCart[i].count);
        }
        countTotalPrice();
        break;
      }
    }
  });
});


