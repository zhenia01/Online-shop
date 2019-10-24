"use strict"

$(function () {
  // menu on small screens
  $(".navbar-menu-button").on("click", () => {
    $(".navbar-nav").toggleClass("menu-open");
    $(".navbar-nav .nav-item").toggleClass("menu-open");
  });
  //////

  // goods counts on the right of the cart
  let goodsCount = 0;
  let $goodsCountElement = $(".goods-count");
  
  let $cart = $(".cart");

  $(".cart-img").on("click", () => {
    if (goodsCount > 0) {
      $("#cart-modal").modal();
      $cart.css("display", "grid");
    } else {
      $("#empty-cart-modal").modal();
    }
  });

  let goodsInCart = [];

  $(".card-buy").on("click", (event) => {
    $goodsCountElement.text(++goodsCount);
    $(".cart-img").css("right", ($goodsCountElement.width() + 10).toString() + "px");

    let $goods = $(event.currentTarget).parent().parent();
    console.log($goods);
    let goodsName = $goods.children().eq(1).children(":first").children(":first").text();

    let isInCart = false;

    for (let i of goodsInCart) {
      if (i.name == goodsName) {
        isInCart = true;
        i.count++;
        break;
      }
    }
    if (!isInCart) {
      goodsInCart.push({
        name: goodsName,
        count: 1
      })
  
      $goods = $goods.clone();
      $goods.children().last().children().last().remove();
      // $goods.append("<div class='count-setter'>KEK</div>")
      $cart.append($goods);
    }
  });
})


