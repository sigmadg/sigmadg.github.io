var collectionFilterPostInit = function() {

	//-- need first for now
	doCollectionWishListPersistent();

	//-- is for Collection filter Section
	var sectionId = "collection-template";

	//-- is there in dt-theme.js.liquid
	dt_initQuickShop(sectionId);
	dt_activateQuickShop();

	scrollToCollectionTop();

};

var showHideClearFilter = function() {
	var constraint = dTCollectionFilter.getConstraint();

	if (constraint.length > 0) {
		$(".dT_ClearAll").css("display", "block");
	} else {
		$(".dT_ClearAll").css("display", "none");
	}
};


var resetGrid = function() {

};


var scrollToCollectionTop = function() {
	$('html, body').animate({
		scrollTop: 0
	}, 1000);
};

/****
 * 
 */

var doCollectionWishListPersistent = function() {
	let dTCompareListOther = dTCompareList; //new dT_WhistList();
	window.dTCompareListOther = dTCompareListOther;
	dTCompareListOther.setListLocalStorageKey('dt-product-compare-list', ",");


    /* eslint-disable no-new */
	new Vue({
		el: '.dT_VProdWrapper',
		delimiters: ['${', '}'],
		data: {},
		computed: {},
		methods: {
			isInWishList: function(handle) {
				return dTWhistList.isAddedIntoList(handle);
			},

			isInCompareList: function(handle) {

				return dTCompareListOther.isAddedIntoList(handle);
			}
		}
	});
};


var doProductGridWishListPersistent = function(class_element) {
	let dTCompareListOther = dTCompareList; //new dT_WhistList();
	window.dTCompareListOther = dTCompareListOther;
	dTCompareListOther.setListLocalStorageKey('dt-product-compare-list', ",");


	new Vue({
		el: class_element,
		delimiters: ['${', '}'],
		data: {},
		computed: {},
		methods: {
			isInWishList: function(handle) {
				return dTWhistList.isAddedIntoList(handle);
			},

			isInCompareList: function(handle) {

				return dTCompareListOther.isAddedIntoList(handle);
			}
		}
	});
};


var doCollectionWishListPersistentOther = function() {
	let dTCompareListOther = dTCompareList; //new dT_WhistList();
	window.dTCompareListOther = dTCompareListOther;
	dTCompareListOther.setListLocalStorageKey('dt-product-compare-list', ",");


	new Vue({
		el: '.dT_VProdWrapperOther',
		delimiters: ['${', '}'],
		data: {},
		computed: {},
		methods: {
			isInWishList: function(handle) {
				return dTWhistList.isAddedIntoList(handle);
			},

			isInCompareList: function(handle) {

				return dTCompareListOther.isAddedIntoList(handle);
			}
		}
	});
};

var doProductSingleWishListPersistent = function() {
	let dTCompareListOther = dTCompareList; //new dT_WhistList();
	window.dTCompareListOther = dTCompareListOther;
	dTCompareListOther.setListLocalStorageKey('dt-product-compare-list', ",");


	new Vue({
		el: '.dT_VProdWishList',
		delimiters: ['${', '}'],
		data: {},
		computed: {},
		methods: {
			isInWishList: function(handle) {
				return dTWhistList.isAddedIntoList(handle);
			},

			isInCompareList: function(handle) {

				return dTCompareListOther.isAddedIntoList(handle);
			}
		}
	});
};




/***
 * 
 */

var scrollToCollectionTop = function() {
	$('html, body').animate({
		scrollTop: 0
	}, 1000);
};



/**
 * 
 */

const dT_AddToCart = function(frm) {
	dTGeneral.loadingAxiosAddToCartCreation();

	axios.post('/cart/add.js', frm)
		.then((response) => {
			//$.magnificPopup.close();
			window.dTGeneral.closeMiniCart();
			window.dTGeneral.showMiniCart();


		})
		.catch((error) => {});
};

const dT_QuickAddToCart = function(frm) {

	dTGeneral.loadingAxiosAddToCartCreation();

	axios.post('/cart/add.js', frm)
		.then((response) => {
			$.magnificPopup.close();

			//window.dTGeneral.closeMiniCart();
			window.dTGeneral.showMiniCart();
		})
		.catch((error) => {});
};



const dT_AddToCartOther = function(frm) {

	dTGeneral.loadingAxiosAddToCartCreation();

	axios.post('/cart/add.js', frm)
		.then((response) => {
			Shopify.moveAlong();
		})
		.catch((error) => {});
};



!(function($) {
	"use strict";



	var setWhishListLoaingClass = function(el) {
		el.removeClass('dT-icon-add-wlist-loaded');
		el.addClass('dT-icon-add-wlist-loading');
	};

	var setWhishListLoadedClass = function(el) {
		setTimeout(function() {
			el.removeClass('dT-icon-add-wlist-loading');
			el.addClass('dT-icon-add-wlist-loaded');
		}, 3000);

		//-- set wish list after loaded page
		el.attr("href", "/pages/wishlist");
		el.removeClass("dT_WhishListAddBtn");

		var viewMyWishList = (DT_THEME.strings.viewMyWishList == '') ? DT_THEME.strings.viewMyWishList : 'View My WishList';
		el.find('span').html(viewMyWishList);
	};

	var specialReloadWhishListGrid = function() {

	};


	$(document).on("click", ".dT_WhishListAddBtn", function(event) {
		event.preventDefault();
		var self = jQuery(this);
		var productHandle = self.attr("data-product_handle");

		Promise.all([
			dTGeneral.openWhishListAddingPreload(),
			setWhishListLoaingClass(self),
			dTWhistList.updateWishlist(productHandle),
			dTGeneral.closeWhishListAddingPreload(),
			setWhishListLoadedClass(self)
		]).then(values => {

		});
	});


	if (document.querySelector(".dT_WishListGrid")) {
		//-- set wish list records
		dTWhistList.setupGrid(getWishList, "wishList");
	}


	function getWishList() {
		var dT_WishListGrid = new Vue({
			el: "#dT_WishListGrid",
			delimiters: ['${', '}'],
			data: {
				wishListRecords: [],
				isNoRecords: false,
				wishListRecordsTemplate: [{
					id: '',
					product_title: '',
					product_handle: '',
					product_image: '',
					vendor: '',
					type: '',
					money_price: '',
					price_min: '',
					price_max: '',
					available: '',
					price_varies: '',
					variant_id: '',
					variant_title: '',
					sku: '',
					quantity: "1",
					product_url: ''
				}]

			},
			computed: {
				// a computed getter
				wishList: function() {
					var Records = dTWhistList.getWishListRecords();

					this.wishListRecords = Records;
					return this.wishListRecords;
				},

				isEmpty: function() {

					return false;
				}
			},
			mounted: function() {
				this.getList();
				this.isEmpty();
			},
			methods: {
				getList: function() {
					var Records = dTWhistList.getWishListRecords();

					this.wishListRecords = Records;
					return this.wishListRecords;
				},
				isEmpty: function() {
					if (this.wishListRecords.length > 0) {
						if (typeof this.wishListRecords === 'object') {
							if (this.wishListRecords[0].id == '') {
								this.isNoRecords = true;
							} else {
								this.isNoRecords = false;
							}
						}
						return this.isNoRecords;
					} else {
						this.isNoRecords = true;
						return this.isNoRecords;
					}
				},
				remove: function(productHandle) {

					try {
						var p2 = new Promise(function(resolve, reject) {
							resolve(1);
						});

						p2.then(function(value) {
							dTGeneral.openWhishListRemovePreload();

							return value + 1;
						}).then(function(value) {
							dTWhistList.removeWhishlist(productHandle);
							dTWhistList.setupGrid('', 'wishList');

							return value + 1;
						}).then(function(value) {
							dTGeneral.closeWhishListRemovegPreload();

							return value + 1;
						}).then(function(value) {
							$('#row_' + productHandle).remove();
							whishListReload();

							return value + 1;
						});


					} catch (err) {} finally {

					}


				}
			}
		});


		var whishListReload = function() {
			dT_WishListGrid.getList();
			dT_WishListGrid.isEmpty();
		};

	}



	$(document).on("click", ".dT_RemoveWhishList", function(event) {
		event.preventDefault();
		var self = jQuery(this);
		var productHandle = self.attr("data-product_handle");

		//$('#row_'+productHandle).remove();
		$(this).closest("tr").remove();

		Promise.all([
			dTGeneral.openWhishListRemovePreload(),
			dTWhistList.removeWhishlist(productHandle),
			dTGeneral.closeWhishListRemovegPreload(),
			specialReloadWhishListGrid()
		]).then(values => {});
	});




	//     if (document.querySelector(".dT_VProdWrapper")) 
	//     {
	//         doCollectionWishListPersistent();
	//     }


	if (document.querySelector(".dT_VProdWishList")) {
		doProductSingleWishListPersistent();
	}

	//     if (document.querySelector(".dT_VProdWrapperOther"))
	//     {
	//         doCollectionWishListPersistentOther();
	//     }


	var a_vueProductGrid = ['.dT_VProdWrapper', '.dT_VProdWrapperOther', '.dT_VRelatedProducts', '.dT_VProdRecommendations'];
	a_vueProductGrid.forEach(function(element, index) {
		if (document.querySelector(element)) {
			doProductGridWishListPersistent(element);
		}
	});




	var recomendatedProductPostInit = function() {

		doProductGridWishListPersistent('.dT_VProdRecommendations');

		//-- is for Collection filter Section
		var sectionId = "collection-template";

		//-- is there in dt-theme.js.liquid
		dt_initQuickShop(sectionId);
		dt_activateQuickShop();

		scrollToCollectionTop();

	};




	var loadProductRecommendationsIntoSection = function() {
		var productRecommendationsSection = document.querySelector(".product-recommendations");
		if (productRecommendationsSection === null) {
			return;
		}
		var productId = productRecommendationsSection.dataset.productId;
		var limit = productRecommendationsSection.dataset.limit;
		var requestUrl = "/recommendations/products?section_id=product-recommendations&limit=" + limit + "&product_id=" + productId;

		//-- @todo need to convert with axios request
		var request = new XMLHttpRequest();
		request.open("GET", requestUrl);
		request.onload = function() {
			if (request.status >= 200 && request.status < 300) {
				var container = document.createElement("div");
				container.innerHTML = request.response;
				productRecommendationsSection.parentElement.innerHTML = container.querySelector(".product-recommendations").innerHTML;


				recomendatedProductPostInit();

			}
		};
		request.send();
	};
	document.addEventListener("shopify:section:load", function(event) {
		if (event.detail.sectionId === "product-recommendations") {
			loadProductRecommendationsIntoSection();
		}
	});

	loadProductRecommendationsIntoSection();


	/**
	 * 03 compare
	 */
	dTCompareList.setListLocalStorageKey('dt-product-compare-list', ",");


	var setCompareListLoaingClass = function(el) {
		el.removeClass('dT-icon-add-compare-loaded');
		el.addClass('dT-icon-add-compare-loading');
	};

	var setCompareListLoadedClass = function(el) {
		setTimeout(function() {
			el.removeClass('dT-icon-add-compare-loading');
			el.addClass('dT-icon-add-compare-loaded');
		}, 3000);

		//-- set wish list after loaded page
		el.attr("href", "/pages/compare");
		el.removeClass("dT_compareListAddBtn");
	};


	$(document).on("click", ".dT_compareListAddBtn", function(event) {
		event.preventDefault();
		var self = jQuery(this);
		var productHandle = self.attr("data-product_handle");

		Promise.all([
			dTGeneral.openCompareListAddingPreload(),
			setCompareListLoaingClass(self),
			dTCompareList.updateWishlist(productHandle),
			dTGeneral.closeCompareListRemovegPreload(),
			setCompareListLoadedClass(self)
		]).then(values => {

		});
	});


	if (document.querySelector(".dT_CompareListGrid")) {
		//-- set wish list records
		dTCompareList.setupGrid(getCompareList, 'compareList');
	}




	function getCompareList() {

		var dT_CompareListGrid = new Vue({
			el: "#dT_CompareListGrid",
			delimiters: ['${', '}'],
			data: {
				compareListRecords: [],
				isNoRecords: false,
				wishListRecordsTemplate: [{
					id: '',
					product_title: '',
					product_handle: '',
					product_image: '',
					vendor: '',
					type: '',
					money_price: '',
					price_min: '',
					price_max: '',
					available: '',
					price_varies: '',
					variant_id: '',
					variant_title: '',
					sku: '',
					quantity: "1",
					product_url: ''
				}]
			},
			computed: {
				createContact: function() {},
				resetForm: function() {}
			},
			mounted: function() {
				this.getList();
				this.isEmpty();
			},
			methods: {
				getList: function() {
					var Records = dTCompareList.getCompareListRecords();
					this.compareListRecords = Records;
					return this.compareListRecords;
				},
				isEmpty: function() {
					if (this.compareListRecords.length > 0) {
						if (typeof this.compareListRecords === 'object') {
							if (this.compareListRecords[0].id == '') {
								this.isNoRecords = true;
							} else {
								this.isNoRecords = false;
							}
						}
						return this.isNoRecords;
					} else {
						this.isNoRecords = true;
						return this.isNoRecords;
					}
				},
				remove: function(productHandle) {


					try {
						var p2 = new Promise(function(resolve, reject) {
							resolve(1);
						});

						p2.then(function(value) {
							dTGeneral.openCompareListRemovePreload();

							return value + 1;
						}).then(function(value) {
							dTCompareList.removeWhishlist(productHandle);
							dTCompareList.setupGrid('', 'compareList');

							return value + 1;
						}).then(function(value) {
							dTGeneral.closeCompareListRemovegPreload();

							return value + 1;
						}).then(function(value) {
							$('.record-' + productHandle).remove();
							compareListReload();

							return value + 1;
						});


					} catch (err) {} finally {
						// $('.record-'+productHandle).remove();
						// dTCompareList.setupGrid('', 'compareList');

					}


				}
			}
		});



		var compareListReload = function() {
			dT_CompareListGrid.getList();
			dT_CompareListGrid.isEmpty();
		};

	}


	$(document).on("click", ".dT_RemoveCompareList", function(event) {
		event.preventDefault();
		var self = jQuery(this);
		var productHandle = self.attr("data-product_handle");

		$('.record-' + productHandle).remove();

		Promise.all([
			dTGeneral.openCompareListRemovePreload(),
			dTCompareList.removeWhishlist(productHandle),
			dTGeneral.closeCompareListRemovegPreload(),
			getCompareList()
		]).then(values => {});
	});



	//-- 04 collection filter





	//-- sidebar filter
	$(document).on("click", ".dT_CollectionFilter", function(event) {
		event.preventDefault();
		var self = jQuery(this);
		var constraintValue = self.attr("data-value");

		if (self.hasClass("active")) {
			self.removeClass('active');
		} else {
			self.addClass('active');
		}

		//-- update search filter Constraint
		dTCollectionFilter.updateConstraint(constraintValue);

		//-- load collection grid
		dTCollectionFilter.updateCollectionGrid();

		showHideClearFilter();

	});

	//-- side bar clear filter
	$(document).on("click", ".dT_ClearAll", function(event) {
		event.preventDefault();
		var self = jQuery(this);

		// reset filter
		dTCollectionFilter.resetConstraint();

		// clear Filter selection
		$(".dT_CollectionFilter").removeClass('active');

		//-- load collection grid
		dTCollectionFilter.updateCollectionGrid();

		showHideClearFilter();

	});


	//-- collection pagination
	$(document).on("click", ".dT_Pagination", function(event) {
		event.preventDefault();
		var self = jQuery(this);

		var paginationURL = self.attr("href");
		paginationURL = paginationURL.split("?");

		if (paginationURL[1] != '') {
			paginationURL = "?" + paginationURL[1];
		}


		var pageNo = dTGeneral.getURLParams(paginationURL, 'page');
		var a_params = {};
		if (pageNo != '') {
			a_params['page'] = pageNo;
		}


		//-- load collection grid
		dTCollectionFilter.updateCollectionGrid(a_params);

		showHideClearFilter();

	});


	//-- collection pagination
	$(document).on("change", ".dT_SortBy", function(event) {
		event.preventDefault();
		var self = jQuery(this);

		var a_params = {};
		a_params['sort_by'] = this.value;

		//-- load collection grid
		dTCollectionFilter.updateCollectionGrid(a_params);

		showHideClearFilter();

	});



	var dTProductDealTimerStart = function() {
		if (document.querySelector(".dT_dealTimer")) {
			$(".dT_dealTimer").each(function(index) {

				var productID = $(this).attr('data-itemID');
				var targetTime = $(this).attr('data-time');

				$(".lof-clock-" + productID + "-detail").lofCountDown({
					TargetDate: targetTime,
					DisplayFormat: "<ul class='list-inline'><li class='day'>%%D%%<span>Days</span></li><li class='hours'>%%H%%<span>Hours</span></li><li class='mins'>%%M%%<span>Min</span></li><li class='seconds'>%%S%%<span>Sec</span></li></ul>",
					FinishMessage: "Expired"
				});

			});

		}

	};


	//-- default initCall
	showHideClearFilter();


	//-- deal Timer
	dTProductDealTimerStart();


	//-- 05 cart


	$(document).on("click", ".dT_AddToCartBtn", function(event) {
		event.preventDefault();

		var frmData = $(".shopify-product-form").serialize();
		dT_AddToCart(frmData);
	});


	$(document).on("click", ".dT_QuickAddToCartBtn", function(event) {
		event.preventDefault();

		var productVarientId = $(this).attr("data-product-varient-id");
		$(".dT_quickProductVarientId").val(productVarientId);

		var frmData = $(".shopify-product-quick-form").serialize();
		dT_QuickAddToCart(frmData);
	});


	$(document).on("submit", "#bundleAddToCartFrmId", function(event) {
		event.preventDefault();

		const setShopifyQue = function() {
			Shopify.queue = [];
			Shopify.isBundleDiscount = true;

			bundleProductIds.forEach(element => {
				var productId = element;
				var productVarientId = $("#bundle_product_price_" + productId).attr("data-varient-id");


				if (productVarientId != '' && $('#bundle_chk_' + productId).is(":checked")) {
					Shopify.queue.push({
						variantId: productVarientId,
					});
				} else {
					Shopify.isBundleDiscount = false;
				}
			});

		};

		const applyBundleDiscount = function(discount_code) {

			if (Shopify.isBundleDiscount == true) {
				axios.get('/discount/' + discount_code, {})
					.then(function(response) {

					});
			}

		};



		const doBundleAddToCart = function() {
			setShopifyQue();

			Shopify.moveAlong = function() {
				if (Shopify.queue.length) {
					var request = Shopify.queue.shift();

					var frmData = 'id=' + request.variantId + '&quantity=1';
					dT_AddToCartOther(frmData);

				} else {
					finalBundleCallBack();
				}
			};

			Shopify.moveAlong();
		};


		const finalBundleCallBack = function() {

			//-- apply discount
			var mainProductId = BUNDLE_MAIN_PRODUCT_ID;
			applyBundleDiscount('DT-DISCOUNT-' + mainProductId);

			//-- trigger mini cart link
			window.dTGeneral.showMiniCart();
		};

		Promise.resolve(doBundleAddToCart())
			.then(function() {

			});


	});


	/**
	 * bundle js
	 */


	// if (document.querySelector(".dT_bundleSelector")) {
	//     //-- toggle choose options
	//     $(document).on("click", ".dT_bundleProductToggle", function (event) {
	//         event.preventDefault();
	//         var self = jQuery(this);
	//         var bundleProductHandle = self.attr("data-bundle-product-handle");
	//         var bundleProductId = self.attr("data-bundle-product-id");

	//         if (jQuery(".dT_varientOptions_" + bundleProductId).is(":visible")) {
	//             jQuery(".dT_varientOptions_" + bundleProductId).slideUp();
	//         } else {
	//             jQuery(".dT_varientOptions_" + bundleProductId).slideDown(); 
	//         }

	//     });


	//     //-- bundle check listiner
	//     $(document).on("change", ".dT_bundleCheck", function (event) {
	//         event.preventDefault();
	//         var self = jQuery(this);
	//         var bundleProductHandle = self.attr("data-product-handle");
	//         var bundleProductId = self.attr("data-product-id");

	//         computeTotalDiscount();

	//     });




	// bundleProductIds.forEach(element => {
	//   var productId = element;

	//   new doBundleProductSwatch
	//   (
	//       document.getElementById('dT_bundle-product-' + productId), 
	//       'dT_BundleProductJson-' + productId, 
	//       '#bundle_productSelect_' + productId, 
	//       ".single-option-selector"
	//   );      

	// });

	//  computeTotalDiscount();

	// }

	/***
	 * 07 search new
	 */

	var hideDT_SearchResultSection = function() {
		$(".dT_PredictiveSearchResult_Section").css('display', 'none');
	};

	var showDT_SearchResultSection = function() {
		$(".dT_PredictiveSearchResult_Section").css('display', 'block');
	};



	$(document).on("click", ".dT_SearchClose", function(event) {
		event.preventDefault();
		var self = jQuery(this);
		$("#SearchInput").val('');
		$("#SearchInput").focus();
		hideDT_SearchResultSection();

		self.css('display', 'none');
	});

	$(document).click(function() {
		hideDT_SearchResultSection();
	});


	$(".dT_TopStickySearchBtn").click(function(ev) {
		ev.preventDefault();
		$("#dT_top-sticky").slideDown('slow');
		scrollToCollectionTop();
	});

	$(".dT_TopStickySearchCloseBtn").click(function(ev) {
		ev.preventDefault();
		$("#dT_top-sticky").slideUp('slow');
	});


})(jQuery);