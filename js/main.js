window.addEventListener("load", function (e) {
  e.preventDefault();
  // renderProductCate(products);

  // // thêm sản phẩm có id vào trong mảng
  // addWishList(dataID);
  // addMiniCart(dataID);
  // render lại giỏ hàng
  renderMiniCart(miniCart);
  renderWishList(wishList);
});
const getELE = (id) => {
  return document.getElementById(id);
};
window.addEventListener("load", function (e) {
  function renderProductCate(data) {
    let divProduct = getELE("listProductCategory");
    let productItem = "";
    for (let item of data) {
      productItem += `
            <div class="col-sm-6 col-lg-4 col-xl-4 item">
                <div class="product" data-id=${item.id} id="dataID">
                    <div class="img">
                        <a href="#">
                            <img src="${item.img}" alt="">
                            <img src="${item.img1}" alt="">
                        </a>
                        <button class="btn a-center d-flex addCartItem" onclick="clickAddToCard(${
                          item.id
                        },event)">
                            <i class="bi bi-handbag"></i> Add To Card
                        </button>
                        <ul class="action action1">
                            <li onclick="clickAddWishList(${
                              item.id
                            },event)" class="wishlist"><i class="far fa-heart"></i><span>Add to Wishlist</span>
                            </li>
                            <li class="compare"><i class="fas fa-sliders-h"></i> <span>Compare</span> </li>
                            <li class="detail" ><i class="fas fa-eye"></i><span>View Details</span></li>
                        </ul>
                    </div>

                    <div class="content">
                        <h4>${item.name}</h4>
                        <div class="price">
                            đ ${(item.price * 1).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
    `;
    }
    if (divProduct !== null) {
      divProduct.innerHTML = productItem;
    }
  }

  // filter sort
  const sortLow = getELE("low");

  if (sortLow !== null) {
    sortLow.addEventListener("click", function () {
      const data = products.sort((a, b) => +a.price - +b.price);
      renderProductCate(data.reverse());
    });
  }
  const sortHight = getELE("high");
  if (sortHight !== null) {
    sortHight.addEventListener("click", function () {
      const data = products.sort((a, b) => +a.price - +b.price);
      renderProductCate(data);
    });
  }

  const optionInput = document.querySelectorAll("input[name='checkproduct']");
  const findSelected = () => {
    const type = document.querySelector("input[name='checkproduct']:checked");
    let newType = "";
    if (type !== null) {
      newType = type.value;
    }
    if (newType == "All") {
      renderProductCate(products);
    } else {
      const data = products.filter((item) => {
        return item.type == newType;
      });
      renderProductCate(data);
    }
  };

  optionInput.forEach((item) => {
    item.addEventListener("change", findSelected);
  });

  findSelected();
});

/* Get , Set LocalStorage */
function setLocal(data, name) {
  if (data) return localStorage.setItem(`${name}`, JSON.stringify(data));
}

function parseLocal(name) {
  const data = localStorage.getItem(name);
  return JSON.parse(data);
}

//======Render miniCart=========
// Hàm dùng để show ra sản phẩm trong giỏ hàng
window.addEventListener("load", function (e) {
  renderMiniCart(miniCart);
});

function renderMiniCart(data) {
  let mini_cart = getELE("mini-cart-product");
  let subTotal = getELE("sub-total");
  let amount = getELE("before");
  let sumPrice = 0;
  let sumQuantity = 0;
  let content = "";
  for (let item of data) {
    content += `
      <tr data-id=${item.id} style="text-align:center">
        <td><img style="width:90px; height="90px" src="${item.img}" alt="${
      item.name
    }"/></td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${(item.price * 1).toLocaleString("vi-VN")}</td>
        <td>${(item.price * item.quantity).toLocaleString("vi-VN")}</td>
        <td><button type="button" class="btn btn-danger" onclick="removeItemMiniCart(${
          item.id
        })">Xoá</button></td>
    </tr>`;
    sumPrice += item.quantity * item.price;
    sumQuantity += item.quantity;
  }

  // render item content
  if (mini_cart !== null) {
    mini_cart.innerHTML = content;
  }

  // render tổng tiền trong miniCart
  if (subTotal !== null) {
    subTotal.innerHTML = sumPrice.toLocaleString("vi-VN");
  }
  // render tổng số lượng  sản phẩm
  if (mini_cart !== null) {
    amount.innerHTML = sumQuantity;
  }
}

function addMiniCart(id) {
  // duyệt giỏ hàng và kiểm tra id trong giỏ hàng có bằng với id người dùng click không
  let index = miniCart.findIndex((spGioHang) => spGioHang.id === id);

  // Lấy ra product = id và đẩy lên miniCart
  const element = products.find((spGioHang) => spGioHang.id == id);

  // Nếu index != -1 thì giỏ hàng đã tồn tại trong giỏ hàng , chỉ việc tăng quantity++
  if (index != -1) {
    // Tìm ra sản phẩm trong giỏ hàng thứ index => tắng số lượng
    miniCart[index].quantity += 1;
  }
  // Nếu sản phẩm chưa tồn tại trong giỏ hàng thì thêm sản phẩm vào giỏ hàng kèm theo thuộc tính quantity:1
  else {
    const newValue = {
      ...element,
      quantity: 1,
    };

    miniCart.push(newValue);
  }

  setLocal(miniCart, "dataCart");
}

clickAddToCard = (dataID, e) => {
  e.preventDefault();

  const parent = document.querySelector(".listProduct");
  // Tìm tất cả class='item' bên trong class cho page-main__list
  const children = [...parent.querySelectorAll(".product")];
  // duyệt mạng tìm ra class con có thuộc tính data-id = dataId click vào
  children.forEach((child) => {
    child.dataset.id === dataID;
  });

  // thêm sản phẩm có id vào trong mảng
  addMiniCart(dataID);
  // render lại giỏ hàng
  renderMiniCart(miniCart);
};

removeItemMiniCart = (id) => {
  const newMiniCart = [...miniCart];
  // Tìm các phần tử có trong giỏ hàng
  let index = newMiniCart.findIndex((spGioHang) => spGioHang.id === id);
  // Nếu tìm được phần tử có trong giỏ hàng
  if (index != -1) {
    // Xoá 1 phần từ tại vị trí index
    miniCart.splice(index, 1);
  } else {
    // set lại giỏ hàng mới
    miniCart = [...newMiniCart];
  }

  // Cập nhật lại giỏ hàng mới
  renderMiniCart(miniCart);

  setLocal(miniCart, "dataCart");
};
/*=========wishlist========== */
window.addEventListener("load", function () {
  renderWishList(wishList);
});

function renderWishList(data) {
  let wish_list = getELE("add-to-wish");
  let amount = getELE("before1");
  let content = "";
  for (let item of data) {
    content += `
      <tr class="itemWishList" data-id=${
        item.id
      } style="text-align:center ;vertical-align: middle">
         <td><button type="button" class="btn btn-danger" onclick="removeItemWishLish(${
           item.id
         })">Xoá</button></td>
        <td><img style="width:90px; height="90px" src="${item.img}" alt="${
      item.name
    }"/></td>
        <td>${item.name}</td>
        <td>${(item.price * 1).toLocaleString("vi-VN")}</td>
        <td><span class="stocked">Trong kho</span></td>
         <td>
              <button class ="btn btn-primary" onclick="clickAddToCardWishList(${
                item.id
              },event)">Add to card</button>
         </td>

    </tr>`;
  }
  // render tổng số lượng  sản phẩm
  amount.innerHTML = wishList.length;
  // render item content
  if (wish_list !== null) {
    wish_list.innerHTML = content;
  }
}
function addWishList(id) {
  // duyệt giỏ hàng và kiểm tra id trong giỏ hàng có bằng với id người dùng click không
  let index = wishList.findIndex((spWishList) => spWishList.id === id);

  // Lấy ra product = id và đẩy lên miniCart
  const element = products.find((spWishList) => spWishList.id == id);

  // Nếu index != -1 thì giỏ hàng đã tồn tại trong giỏ hàng , chỉ việc tăng quantity++
  if (index != -1) {
    // Tìm ra sản phẩm trong giỏ hàng thứ index => tắng số lượng
    alert("Sản phầm đã được yêu thích!");
  }
  // Nếu sản phẩm chưa tồn tại trong giỏ hàng thì thêm sản phẩm vào giỏ hàng kèm theo thuộc tính quantity:1
  else {
    const newValue = {
      ...element,
      quantity: 1,
    };

    wishList.push(newValue);
  }

  setLocal(wishList, "WishListProduct");
}
clickAddWishList = (dataID, e) => {
  e.preventDefault();

  const parent = document.querySelector(".listProduct");
  // Tìm tất cả class='item' bên trong class cho page-main__list
  const children = [...parent.querySelectorAll(".product")];
  // duyệt mạng tìm ra class con có thuộc tính data-id = dataId click vào
  children.forEach((child) => {
    child.dataset.id === dataID;
  });
  // thêm sản phẩm có id vào trong mảng
  addWishList(dataID);
  // render lại giỏ hàng
  renderWishList(wishList);
};

removeItemWishLish = (id) => {
  const newWishList = [...wishList];
  // Tìm các phần tử có trong giỏ hàng
  let index = newWishList.findIndex((spWishList) => spWishList.id === id);
  // Nếu tìm được phần tử có trong giỏ hàng
  if (index != -1) {
    // Xoá 1 phần từ tại vị trí index
    wishList.splice(index, 1);
  } else {
    // set lại giỏ hàng mới
    wishList = [...newWishList];
  }

  // Cập nhật lại giỏ hàng mới
  renderWishList(wishList);
  setLocal(wishList, "WishListProduct");
};

clickAddToCardWishList = (dataID, e) => {
  e.preventDefault();

  const parent = document.querySelector(".add-to-wish");
  // Tìm tất cả class='item' bên trong class cho page-main__list
  const children = [...parent.querySelectorAll(".itemWishList")];
  // duyệt mạng tìm ra class con có thuộc tính data-id = dataId click vào
  children.forEach((child) => {
    child.dataset.id === dataID;
  });

  // thêm sản phẩm có id vào trong mảng
  addMiniCart(dataID);
  // render lại giỏ hàng

  renderMiniCart(miniCart);

  removeItemWishLish(dataID);
};

//======Render Checkout============
window.addEventListener("load", function () {
  renderCheckOut(miniCart);
});

function renderCheckOut(data = []) {
  let ListCheckOut = getELE("ListCheckOut");
  let subTotal = getELE("checkout__total-sub");
  let sumPrice = 0;
  let content = "";
  for (let item of data) {
    content += `
      <tr data-id=${item.id}>
        <td>${item.name} × ${item.quantity}</td>
        <td style="text-align:end">${(
          item.price * item.quantity
        ).toLocaleString("vi-VN")}</td>
    </tr>`;
    sumPrice += item.quantity * item.price;
  }
  // render item content
  if (ListCheckOut !== null) {
    ListCheckOut.innerHTML = content;
  }

  // render tổng tiền trong miniCart
  if (subTotal !== null) {
    subTotal.innerHTML = sumPrice.toLocaleString("vi-VN");
  }
}

//======Render Model Details=========
// window.addEventListener("load", function (e) {
//   renderMiniCart(miniCart);
// });

function renderModalDetail(id) {
  let modal_detail = getELE("modal-detail");
  let content = "";
  content = `
         <div class="img item-modal">
            <div class="quickview" id="quickview">

            </div>

            <a class="btn btn-primary viewDetails" onclick="clickDetails(${id},event)">
                 View Details
            </a>

          </div>
            <div class="content item-modal" id="item-modal">

            </div> 
     `;
  // render item content
  if (modal_detail !== null) {
    modal_detail.innerHTML = content;
  }
}

//======Render Quick View=========
// Hàm dùng để show ra sản phẩm trong giỏ hàng
window.addEventListener("load", function (e) {
  // renderQuickView(miniCart);
});

function renderModalQuickView(id) {
  let quick_view = getELE("quickview");
  let content = "";
  const listImg = getAllimg().find((val) => val.id == id);
  listImg.img.forEach((item) => {
    content += `
       <div class="item">
            <img src="${item}" alt="">
        </div>`;
  });

  // render item content
  if (quick_view !== null) {
    quick_view.innerHTML = content;
  }
}

function renderModalContentQuickView(id) {
  const data = products.find((val) => val.id == id);
  let item_modal = getELE("item-modal");
  let content1 = "";
  content1 = `
        <a href="#">${data.name}</a>
         <div class="star">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i> (1 customer review)
          </div>
          <p class="price">$${(data.price * 1).toLocaleString("vi-VN")}</p>
          <p class="des">
                Tailored line. Wool mix fabric. Long design. Long buttoned sleeve. Lapel with notch. Back slit.
                Two pockets with flaps on the front. Button up. Inner lining. Inner pocket. Back length 95.0
                cm.<br>
                Summer tops for women<br>
                Cheetah kimonos ,beach cover ups<br>
                Lightweight chiffon casual shirts<br>
                Open front outwear,short sleeve blouse.<br>
          </p>
          <div class="action d-flex align-items-center" data-id = ${data.id}>
                <div class="control-item d-flex align-items-center">
                    <a class ="dash-1" href=""><i class="bi bi-dash"></i></a>
                    <input type="text"class="InputAmountProduct" value="1">
                    <a class ="plus-1" href=""><i class="bi bi-plus"></i></a>
                </div>
                <button  class="btn align-items-center d-flex addCartItem" onclick="clickAddToCard(${
                  data.id
                },event)">
                    <i class="bi bi-handbag me-2"></i> Add To Card
                </button>
            </div>
   `;
  if (item_modal !== null) {
    item_modal.innerHTML = content1;
  }
}
clickQuickView = (dataID, e) => {
  e.preventDefault();

  const parent = document.querySelector(".listProduct");
  // Tìm tất cả class='item' bên trong class cho page-main__list
  const children = [...parent.querySelectorAll(".product")];
  // duyệt mạng tìm ra class con có thuộc tính data-id = dataId click vào
  children.forEach((child) => {
    child.dataset.id === dataID;
  });
  renderModalDetail(dataID);
  // render lại giỏ hàng
  renderModalQuickView(dataID);

  renderModalContentQuickView(dataID);
};
