<script>
/**********************
* DATALAYER ARCHITECTURE: SHOPIFY 
* DEFINITION: A data layer helps you collect more accurate analytics data, that in turn allows you to better understand what potential buyers are doing on your website and where you can make improvements. It also reduces the time to implement marketing tags on a website, and reduces the need for IT involvement, leaving them to get on with implementing new features and fixing bugs.

* RESOURCES:
* http://www.datalayerdoctor.com/a-gentle-introduction-to-the-data-layer-for-digital-marketers/
* http://www.simoahava.com/analytics/data-layer/

* EXTERNAL DEPENDENCIES:
* jQuery
* jQuery Cookie Plugin v1.4.1 - https://github.com/carhartl/jquery-cookie
* cartjs - https://github.com/discolabs/cartjs

* DataLayer Architecture: Shopify v1.2
* COPYRIGHT 2021
* LICENSES: MIT ( https://opensource.org/licenses/MIT )
*/

/**********************
* PRELOADS 
* load jquery if it doesn't exist
***********************/ 

if(!window.jQuery){
    var jqueryScript = document.createElement('script');
    jqueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'); 
    document.head.appendChild(jqueryScript); 
}

function __DL__cartResponseFormatter (line_item) {
    var options = {}
    line_item.options_with_values.forEach(function(v) {
        options[v.name] = v.value
    })
    return {
            'item_name'     : line_item.title,
            'item_id'       : line_item.product_id,
            'variant_id'  : line_item.variant_id,
            'sku'      : line_item.sku,
            'price'    : line_item.final_price / 100,
            'quantity' : line_item.quantity,
            'item_type'     : line_item.product_type,
            'item_options'  : options,
    }
};
function __DL__arr_diff(b,c){
    var a=[],diff=[];
    for(var i=0;i<b.length;i++){
        a[b[i]]=true
    }
    for(var i=0;i<c.length;i++){
        if(a[c[i]]){delete a[c[i]]}
        else{a[c[i]]=true}
    }
    for(var k in a){diff.push(k)}
    return diff
};
                                

__DL__jQueryinterval = setInterval(function(){
    // wait for jQuery to load & run script after jQuery has loaded
    if(window.jQuery){
        // search parameters
        getURLParams = function(name, url){
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        
        /**********************
        * DYNAMIC DEPENDENCIES
        ***********************/
        
        __DL__ = {
            dynamicCart: true,  // if cart is dynamic (meaning no refresh on cart add) set to true
            debug: true, // if true, console messages will be displayed
            cart: null,
            removeCart: null
        };
        
        customBindings = {
            cartTriggers: [],
            viewCart: [],
            removeCartTrigger: [],
            cartVisableSelector: [],
            searchPage: [],
            searchTermQuery: [getURLParams('q')], // replace var with correct query
        };
        
        /* DO NOT EDIT */
        defaultBindings = {
            cartTriggers: ['form[action="/cart/add"] [type="submit"],.add-to-cart,.cart-btn'],
            viewCart: ['form[action="/cart"],.my-cart,.trigger-cart,#mobileCart'],
            removeCartTrigger: ['[href*="/cart/change"]'],
            cartVisableSelector: ['.inlinecart.is-active,.inline-cart.is-active'],
            searchPage: ['search'],
        };
        
        // stitch bindings
        objectArray = customBindings;
        outputObject = __DL__;
        
        applyBindings = function(objectArray, outputObject){
            for (var x in objectArray) {  
                var key = x;
                var objs = objectArray[x]; 
                values = [];    
                if(objs.length > 0){    
                    values.push(objs);
                    if(key in outputObject){              
                        values.push(outputObject[key]); 
                        outputObject[key] = values.join(", "); 
                    }else{        
                        outputObject[key] = values.join(", ");
                    }   
                }  
            }
        };
        
        applyBindings(customBindings, __DL__);
        applyBindings(defaultBindings, __DL__);
        
        /**********************
        * PREREQUISITE LIBRARIES 
        ***********************/
        
        clearInterval(__DL__jQueryinterval);
        
        // jquery-cookies.js
        if(typeof $.cookie!==undefined){(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else if(typeof exports==='object'){module.exports=a(require('jquery'))}else{a(jQuery)}}(function($){var g=/\+/g;function encode(s){return h.raw?s:encodeURIComponent(s)}function decode(s){return h.raw?s:decodeURIComponent(s)}function stringifyCookieValue(a){return encode(h.json?JSON.stringify(a):String(a))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\')}try{s=decodeURIComponent(s.replace(g,' '));return h.json?JSON.parse(s):s}catch(e){}}function read(s,a){var b=h.raw?s:parseCookieValue(s);return $.isFunction(a)?a(b):b}var h=$.cookie=function(a,b,c){if(arguments.length>1&&!$.isFunction(b)){c=$.extend({},h.defaults,c);if(typeof c.expires==='number'){var d=c.expires,t=c.expires=new Date();t.setMilliseconds(t.getMilliseconds()+d*864e+5)}return(document.cookie=[encode(a),'=',stringifyCookieValue(b),c.expires?'; expires='+c.expires.toUTCString():'',c.path?'; path='+c.path:'',c.domain?'; domain='+c.domain:'',c.secure?'; secure':''].join(''))}var e=a?undefined:{},cookies=document.cookie?document.cookie.split('; '):[],i=0,l=cookies.length;for(;i<l;i++){var f=cookies[i].split('='),name=decode(f.shift()),cookie=f.join('=');if(a===name){e=read(cookie,b);break}if(!a&&(cookie=read(cookie))!==undefined){e[name]=cookie}}return e};h.defaults={};$.removeCookie=function(a,b){$.cookie(a,'',$.extend({},b,{expires:-1}));return!$.cookie(a)}}))}
        
        /**********************
        * Begin dataLayer Build 
        ***********************/
        
        /**
        * DEBUG
        * Set to true or false to display messages to the console
        */
        if(__DL__.debug){
            console.log('=====================\n| DATALAYER SHOPIFY |\n---------------------');
            console.log('Page Template: {{ template }}');
        }
        
        window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist
        dataLayer.push({'event': 'Begin DataLayer'}); // begin datalayer
        
        var template = "{{template}}"; 
        
        /**
        * Landing Page Cookie
        * 1. Detect if user just landed on the site
        * 2. Only fires if Page Title matches website */
        
        $.cookie.raw = true;
        if ($.cookie('landingPage') === undefined || $.cookie('landingPage').length === 0) {
            var landingPage = true;
            $.cookie('landingPage', unescape);
            $.removeCookie('landingPage', {path: '/'});
            $.cookie('landingPage', 'landed', {path: '/'});
        } else {
            var landingPage = false;
            $.cookie('landingPage', unescape);
            $.removeCookie('landingPage', {path: '/'});
            $.cookie('landingPage', 'refresh', {path: '/'});
        }
        if (__DL__.debug) {
            console.log('Landing Page: ' + landingPage);
        }
        
        /** 
        * Log State Cookie */
        
        {% if customer %}
            var isLoggedIn = true;
        {% else %}
            var isLoggedIn = false;
        {% endif %}
        if (!isLoggedIn) {
            $.cookie('logState', unescape);
            $.removeCookie('logState', {path: '/'});
            $.cookie('logState', 'loggedOut', {path: '/'});
        } else {
            if ($.cookie('logState') === 'loggedOut' || $.cookie('logState') === undefined) {
                $.cookie('logState', unescape);
                $.removeCookie('logState', {path: '/'});
                $.cookie('logState', 'firstLog', {path: '/'});

                // ログアウト -> ログイン状態に遷移したタイミングで、ログインイベントを送る
                var loginEvent = {
                    "event": "login",
                };
                dataLayer.push(loginEvent);
            } else if ($.cookie('logState') === 'firstLog') {
                $.cookie('logState', unescape);
                $.removeCookie('logState', {path: '/'});
                $.cookie('logState', 'refresh', {path: '/'});
            }
        }
        
        /**********************
        * DATALAYER SECTIONS 
        ***********************/
        
        /** 
        * DATALAYER: basic_dl_info
        * 1. Determine if user is logged in or not.
        * 2. Return User specific data. */
        var basic_dl_info = {
            {% if shop.customer_accounts_enabled %}
                {% if customer %}
                    'user_id'        : {{customer.id | json}},
                    'user_type'      : "Member",
                {% else %}
                    'user_id' : null,
                    'user_type' : "Guest",
                {% endif %}
            {% endif %}
            'currency'      : {{shop.currency | json}},
            'page_type'      : {{template | json}},
            'event'         : 'basic_dl_info'
        }
        dataLayer.push(basic_dl_info);
        if(__DL__.debug){
            console.log("basic_dl_info"+" :"+JSON.stringify(basic_dl_info, null, " "));
        }
        
        /** DATALAYER: Product List Page (Collections, Category)
        * Fire on all product listing pages. */
        {% if template contains 'collection' and template != 'list-collections' %}
            var collections = {
                'event'       : 'view_item_list',
                'item_list_name' : {{collection.title | json}},
                'ecommerce': {
                    'items': [
                        {% for product in collection.products %}
                        {
                            'item_name'            : {{product.title | json}},
                            'item_id'              : {{product.id | json}},
                            'variant_id'       : {{product.selected_or_first_available_variant.id | json}},
                            'sku'             : {{product.selected_or_first_available_variant.sku | json}},
                            'price'           : {{product.price | money_without_currency | remove: "," | json}},
                            'item_brand'           : {{shop.name | json}},              
                            'item_type'     : {{product.type | json}},
                            'item_category' : {{product.collections[0].title | json}},
                            'item_category2' : {{product.collections[1].title | json}},
                            'item_category3' : {{product.collections[2].title | json}},
                            'item_category4' : {{product.collections[3].title | json}},
                            'item_category5' : {{product.collections[4].title | json}},
                            'item_options'  : {
                                {% for option in product.options_with_values %}
                                {% for value in option.values %}
                                {% if option.selected_value == value %}
                                {{option.name | json}} : {{value | json}},
                                {% endif %}
                                {% endfor %}
                                {% endfor %}
                            }
                        },
                        {% endfor %}
                    ]
                }
            };
            dataLayer.push(collections);
            if(__DL__.debug){
                console.log("view_item_list"+" :"+JSON.stringify(collections, null, " "));
            }
        {% endif %}
            
        /** DATALAYER: Product Page
        * Fire on all Product View pages. */
        if (template.match(/.*product.*/gi) && !template.match(/.*collection.*/gi)) {
            var product = {
                'event'    : 'view_item',
                'ecommerce': {
                    'currency'      : {{shop.currency | json}},
                    'value'      : {{product.price | money_without_currency | remove: "," | json}}, // TODO: discountなどの考慮
                    'items': [{
                        'item_name'            : {{product.title | json}},
                        'item_id'              : {{product.id | json}},
                        'variant_id'       : {{product.selected_or_first_available_variant.id | json}},
                        'sku'             : {{product.selected_or_first_available_variant.sku | json}},
                        'price'           : {{product.price | money_without_currency | remove: "," | json}},
                        'item_brand'           : {{shop.name | json}},              
                        'item_type'     : {{product.type | json}},
                        'item_category' : {{product.collections[0].title | json}},
                        'item_category2' : {{product.collections[1].title | json}},
                        'item_category3' : {{product.collections[2].title | json}},
                        'item_category4' : {{product.collections[3].title | json}},
                        'item_category5' : {{product.collections[4].title | json}},
                        'item_options'  : {
                            {% for option in product.options_with_values %}
                            {% for value in option.values %}
                            {% if option.selected_value == value %}
                            {{option.name | json}} : {{value | json}},
                            {% endif %}
                            {% endfor %}
                            {% endfor %}
                        }
                    }]
                }
            };
            
            function productView(){
                dataLayer.push(product);
                if(__DL__.debug){
                    console.log("view_item"+" :"+JSON.stringify(product, null, " "));
                }
            }
            productView();
        }

        /** DATALAYER: Search Results */
        var searchPage = new RegExp(__DL__.searchPage, "g");
        if(document.location.pathname.match(searchPage)){
            var search = {
                'search_term' : {{search.terms | json}},
                'event'      : "search"
            };
            
            dataLayer.push(search);
            if(__DL__.debug){
                console.log("search"+" :"+JSON.stringify(search, null, " "));
            }
        }

        /** DATALAYER: select_item
         * すべてのページのaタグにイベントハンドラを登録。
         * どの商品ページへのリンクをクリックしたかで、選択された商品を判定
         * 
        */
        $(function() {
            $(document).on("click", "a", function(event) {
                var target = event.currentTarget
                if(!target.attributes || !target.attributes.href) return;
                var link = decodeURIComponent(target.attributes.href.value);
                console.log(link);
                if (!link.startsWith('/products/')) return;
                var matched = /\/products\/([^\?]*).*/.exec(link);
                if (!matched[1]) return;
                var selected_item_name = matched[1];
                var select_item = {
                    "event": 'select_item',
                    "item_name": selected_item_name
                }
                // コレクションページの場合、追加情報を送る
                {% if template contains 'collection' and template != 'list-collections' %}
                    select_item['item_list_name'] = {{collection.title | json}}

                    // クリックされた商品情報詳細
                    var products = {
                        {% for product in collection.products %}
                        {{product.handle | json}} : {
                                'item_name'            : {{product.title | json}},
                                'item_id'              : {{product.id | json}},
                                'variant_id'       : {{product.selected_or_first_available_variant.id | json}},
                                'sku'             : {{product.selected_or_first_available_variant.sku | json}},
                                'price'           : {{product.price | money_without_currency | remove: "," | json}},
                                'item_brand'           : {{shop.name | json}},              
                                'item_type'     : {{product.type | json}},
                                'item_category' : {{product.collections[0].title | json}},
                                'item_category2' : {{product.collections[1].title | json}},
                                'item_category3' : {{product.collections[2].title | json}},
                                'item_category4' : {{product.collections[3].title | json}},
                                'item_category5' : {{product.collections[4].title | json}},
                                'item_options'  : {
                                    {% for option in product.options_with_values %}
                                    {% for value in option.values %}
                                    {% if option.selected_value == value %}
                                    {{option.name | json}} : {{value | json}},
                                    {% endif %}
                                    {% endfor %}
                                    {% endfor %}
                                }
                            },
                        {% endfor %}
                    }
                    if (products[selected_item_name]) {
                        select_item['ecommerce'] = {
                            'items' : [
                                products[selected_item_name]
                            ]
                        }
                    }
                {% endif %}
                dataLayer.push(select_item);
                if(__DL__.debug){
                    console.log("select_item"+" :"+JSON.stringify(select_item, null, " "));
                }
            })
        })
                
        /** DATALAYER: view_cart
        * Fire anytime a user views their cart (non-dynamic) */
        
        {% if template contains 'cart' %}
            var cart = {
                'event'    : 'view_cart',
                'currency'      : {{cart.currency.iso_code | json}},
                'value'      : {{cart.total_price | money_without_currency | remove: "," | json}},
                'ecommerce': {
                    'items':[
                    {% for line_item in cart.items %}
                        {
                            'item_name'            : {{line_item.product.title | json}},
                            'item_id'              : {{line_item.product.id | json}},
                            'variant_id'       : {{line_item.variant_id | json}},
                            'sku'             : {{line_item.sku | json}},
                            'price'           : {{line_item.final_price | money_without_currency | remove: "," | json}},
                            'item_brand'           : {{shop.name | json}},              
                            'item_type'     : {{line_item.product.type | json}},
                            'item_category' : {{line_item.product.collections[0].title | json}},
                            'item_category2' : {{line_item.product.collections[1].title | json}},
                            'item_category3' : {{line_item.product.collections[2].title | json}},
                            'item_category4' : {{line_item.product.collections[3].title | json}},
                            'item_category5' : {{line_item.product.collections[4].title | json}},
                            'item_options'  : {
                                {% for option in line_item.product.options_with_values %}
                                {% for value in option.values %}
                                {% if option.selected_value == value %}
                                {{option.name | json}} : {{value | json}},
                                {% endif %}
                                {% endfor %}
                                {% endfor %}
                            },
                            'quantity': {{line_item.quantity | json}}
                        },
                    {% endfor %}],
                }
            };
        
            dataLayer.push(cart);
            if(__DL__.debug){
                console.log("view_cart"+" :"+JSON.stringify(cart, null, " "));
            }
        
            __DL__.cart = cart.ecommerce.items;
            $(document).on('click', __DL__.removeCartTrigger, function (event) {
                setTimeout(function(){
                    // remove from cart
                    jQuery.getJSON("/cart", function (response) {
                        // get Json response 
                        __DL__.removeCart = response.items.map(__DL__cartResponseFormatter)
                        var cartIDs = [];
                        var removeIDs = [];
                        var removeCart = [];

                        // remove from cart logic
                        for(var i=__DL__.cart.length-1;i>=0;i--){
                            var x=parseFloat(__DL__.cart[i].variant_id);
                            cartIDs.push(x)
                        }
                        for(var i=__DL__.removeCart.length-1;i>=0;i--){
                            var x=parseFloat(__DL__.removeCart[i].variant_id);
                            removeIDs.push(x)
                        }
                        var x=__DL__arr_diff(cartIDs,removeIDs)[0];
                        for(var i=__DL__.cart.length-1;i>=0;i--){
                            if(__DL__.cart[i].variant_id==x){removeCart.push(__DL__.cart[i])}
                        }
                        var e = {
                            'event'    : 'remove_from_cart',
                            'ecommerce' : {
                                'items': removeCart,
                            }
                        }
                        dataLayer.push(e);
                        if (__DL__.debug) {
                            console.log("remove_from_cart"+" :"+JSON.stringify(e, null, " "));
                        }

                        __DL__.cart = __DL__.removeCart
                    });
                }, 2000);
            });
        {% endif %}
                
        /** DATALAYER: All Pages
        * Fire all pages trigger after all additional dataLayers have loaded. */
        
        dataLayer.push({
            'event': 'DataLayer Loaded'
        });
        
        console.log('DATALAYER: DataLayer Loaded.');
        
        /**********************
        * DATALAYER EVENT BINDINGS
        ***********************/
        
        /** DATALAYER: 
        * Add to Cart / Dynamic Cart View
        * Fire all pages trigger after all additional dataLayers have loaded. */
        
        $(document).ready(function() {
            
            /** DATALAYER: Cart */
            
            // stage cart data
            function mapJSONcartData(){
                jQuery.getJSON('/cart.js', function (response) {
                    // get Json response 
                    __DL__.cart = response.items.map(__DL__cartResponseFormatter)
                    var cart = {
                        'event'    : 'add_to_cart',
                        'ecommerce': {
                            'items': __DL__.cart,
                        },
                    };
                    if(cart.ecommerce.items.length > 0){
                        dataLayer.push(cart);
                        if (__DL__.debug) {
                            console.log("add_to_cart"+" :"+JSON.stringify(cart, null, " "));
                        }
                    }
                });
            }
            
            
            // add to cart
            jQuery.getJSON('/cart.js', function (response) {
                // get Json response 
                __DL__.cart = response.items.map(__DL__cartResponseFormatter)
                collection_cartIDs = [];
                collection_matchIDs = [];
                for (var i = __DL__.cart.length - 1; i >= 0; i--) {
                    var x = parseFloat(__DL__.cart[i].variant_id);
                    collection_cartIDs.push(x);
                }
            });
            
            function __DL__addtocart(){
                // FIXME: すぐページ遷移する場合、イベントを送れない。
                    setTimeout(function(){
                        jQuery.getJSON('/cart.js', function (response) {
                            // get Json response 
                            __DL__.cart = response.items.map(__DL__cartResponseFormatter)
                            for (var i = __DL__.cart.length - 1; i >= 0; i--) {
                                var x = parseFloat(__DL__.cart[i].variant_id);
                                collection_matchIDs.push(x);
                            }
                            var x = __DL__arr_diff(collection_cartIDs, collection_matchIDs).pop();
                            collection_cartIDs = collection_matchIDs;
                            collection_matchIDs = [];
                            console.log(x);
                            for (var i = __DL__.cart.length - 1; i >= 0; i--) {
                                if (__DL__.cart[i].variant_id.toString() === x) {
                                    product = __DL__.cart[i];
                                    var e = {
                                        'event'    : 'add_to_cart',
                                        'ecommerce': {
                                            'items': [
                                                product
                                            ]
                                        }
                                    }
                                    dataLayer.push(e);
                                    if (__DL__.debug) {
                                        console.log("add_to_cart"+" :"+JSON.stringify(e, null, " "));
                                    }
                                }
                            }
                        });
                    },1000);
            }
            
            $(document).on('click', __DL__.cartTriggers, function() {
                __DL__addtocart();
            });
                
        }); // document ready
    }
}, 500);
</script>
                        