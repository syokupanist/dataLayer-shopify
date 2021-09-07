<script>
(function () {
    __DL__ = {
        debug: true, // if true, console messages will be displayed
    };

    window.dataLayer = window.dataLayer || [];  // init data layer if doesn't already exist
    dataLayer.push({'event': 'Begin DataLayer'}); // begin datalayer

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

    /** DATALAYER: Checkout */
    if(Shopify.Checkout){
        var transactionData = {
            'event'    :'purchase',
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
            'ecommerce': {
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
})();

// Google Tag Manager 
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WT8RDWM');
</script>
