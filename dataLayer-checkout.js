<script>
function sha256(str) {
    var buff = new Uint8Array([].map.call(str, (c) => c.charCodeAt(0))).buffer;
    return crypto.subtle.digest('SHA-256', buff).then(digest => {
      return [].map.call(new Uint8Array(digest), x => ('00' + x.toString(16)).slice(-2)).join('') 
    })
}

function pafit_dl() {
    __DL__ = {
        debug: true, // if true, console messages will be displayed
    };

    window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist
    dataLayer.push({'event': 'Begin DataLayer'}); // begin datalayer

    var page_type = {{template | json}};
    if (document.location.pathname.includes("thank_you")) {
        page_type = 'transaction_complete';
    }

    /** 
    * DATALAYER: basic_dl_info */
    var basic_dl_info = {
        'currency'      : {{shop.currency | json}},
        'page_type'      : {{template | json}},
        'event'         : 'basic_dl_info'
    }
    
    {% if shop.customer_accounts_enabled %}
        {% if customer %}
            basic_dl_info['user_id']  = {{customer.id | json}}
            basic_dl_info['user_type'] = "Member"
            basic_dl_info['hashed_em'] = __DL__hashed_em
        {% else %}
            basic_dl_info['user_id'] = null
            basic_dl_info['user_type'] = "Guest"
        {% endif %}
    {% endif %}
    dataLayer.push(basic_dl_info);
    if(__DL__.debug){
        console.log("basic_dl_info"+" :"+JSON.stringify(basic_dl_info, null, " "));
    }

    /** DATALAYER: Checkout */
    if(Shopify.Checkout){
        var transactionData = {
            'event'    :'purchase',
            'ecommerce': {
                'currency'          : {{checkout.currency | json}},
                'transaction_id'          : {{checkout.order_number | json}},
                'value'       : {{checkout.total_price | money_without_currency| remove: "," | json}},
                'affiliation' : {{shop.name | json}},
                {% for discount in checkout.discounts %}
                'coupon' : {{discount.code | json}},
                'discount'  : {{discount.amount | money_without_currency | json}},
                {% endfor %}
                'shipping'    : {{checkout.shipping_price | money_without_currency| remove: "," | json}},
                'tax'         : {{checkout.tax_price | money_without_currency| remove: "," | json}},
                'items':[
                {% for line_item in checkout.line_items %}
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

        if(Shopify.Checkout.step && Shopify.Checkout.page == "thank_you"){ 
            dataLayer.push(transactionData);       
            if(__DL__.debug == true){
                console.log("purchase"+" :"+JSON.stringify(transactionData, null, " "));  
            }
        }
    }
}

var __DL__hashed_em = '';
sha256({{customer.email | json}}).then(h => { 
    __DL__hashed_em = h ;
    pafit_dl();
})

// Google Tag Manager 
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WT8RDWM');
</script>
