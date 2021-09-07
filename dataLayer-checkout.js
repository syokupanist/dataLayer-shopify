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
        __DL__products = [];
        {% for line_item in checkout.line_items %}
            __DL__products.push({
                'id'          : {{line_item.product_id | json}},
                'sku'         : {{line_item.sku | json}},
                'variantId'   : {{line_item.variant_id | json}},
                'name'        : {{line_item.title | json}},
                'productType' : {{line_item.product.type | json}},
                'price'       : {{line_item.price | money_without_currency | remove: "," | json}},
                'quantity'    : {{line_item.quantity | json}},
                'description' : {{line_item.product.description | strip_newlines | strip_html  | json }},
                'imageURL'    : "https:{{line_item.product.featured_image.src|img_url:'grande'}}", 
                'productURL'  : '{{shop.secure_url}}{{line_item.product.url}}'
            });
        {% endfor %}

        transactionData = {
            'transactionNumber'      : {{checkout.order_id | json}},
            'transactionId'          : {{checkout.order_number | json}},
            'transactionAffiliation' : {{shop.name | json}},
            'transactionTotal'       : {{checkout.total_price | money_without_currency| remove: "," | json}},
            'transactionTax'         : {{checkout.tax_price | money_without_currency| remove: "," | json}},
            'transactionShipping'    : {{checkout.shipping_price | money_without_currency| remove: "," | json}},
            'transactionSubtotal'    : {{checkout.subtotal_price | money_without_currency| remove: "," | json}},
            {% for discount in checkout.discounts %}
            'promoCode' : {{discount.code | json}},
            'discount'  : {{discount.amount | money_without_currency | json}},
            {% endfor %}
            
            'products': __DL__products
        };
    
        if(Shopify.Checkout.step){ 
            /** DATALAYER: Transaction */
            if(Shopify.Checkout.page == "thank_you"){
                dataLayer.push(transactionData,{
                    'pageType' :'Transaction',
                    'event'    :'Transaction'
                });       
                if(__DL__.debug == true){
                    console.log("Transaction Data"+" :"+JSON.stringify(transactionData, null, " "));  
                }
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
