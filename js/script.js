


Math.sign = Math.sign || function(x) {
    x = +x; //convert to number
    if (x === 0 || isNaN(x))
        return x;
    return x > 0 ? 1 : -1;
}

var optionLabels = [
    
    { name: 'color', label: 'Skin color' },
    
    { name: 'breast', label: 'Breast size' },
    
    { name: 'fists', label: 'Fists' },
    
    { name: 'legs', label: 'Heel legs' },
    
    { name: 'shoes', label: 'Heel shoes' },
    
    { name: 'makeup', label: 'Makeup' },
    
    { name: 'bodytype', label: 'Body type' },
    
    { name: 'forceps', label: 'Forceps' },
    
    { name: 'adapter', label: 'Neck adapter' },
    
];

var shippingPrices = [
    { package: 'small', base: 30, add: 10, batch: 6 },
    { package: 'big',   base: 60,   add: 15,   batch: 2 },
];

function calculatePrice() {
    var price = ~~$('.base_price').text();












    if ($('.item_color').val() === 'Tan')
        price += ~~$('.color_price').text();



    if ($('.item_color').val() === 'Brown')
        price += ~~$('.color_price').text();

























    if ($('.item_fists').val() === 'Yes')
        price += ~~$('.fists_price').text();







    if ($('.item_legs').val() === 'Feet')
        price += ~~$('.feet_price').text();



    if ($('.item_legs').val() === 'Shins')
        price += ~~$('.shins_price').text();



    if ($('.item_legs').val() === 'Feet and shins')
        price += ~~$('.feet_price').text();

    if ($('.item_legs').val() === 'Feet and shins')
        price += ~~$('.shins_price').text();







    if ($('.item_shoes').val() === 'Pumps')
        price += ~~$('.pumps_price').text();



    if ($('.item_shoes').val() === 'Platforms')
        price += ~~$('.platforms_price').text();



    if ($('.item_shoes').val() === 'Pumps and platforms')
        price += ~~$('.pumps_price').text();

    if ($('.item_shoes').val() === 'Pumps and platforms')
        price += ~~$('.platforms_price').text();







    if ($('.item_makeup').val() === 'Yes')
        price += ~~$('.makeup_price').text();



    if ($('.item_makeup').val() === 'Yes - Type A')
        price += ~~$('.makeup_price').text();



    if ($('.item_makeup').val() === 'Yes - Type B')
        price += ~~$('.makeup_price').text();







    if ($('.item_bodytype').val() === 'Male')
        price += ~~$('.bodytype_price').text();



    if ($('.item_bodytype').val() === 'Female')
        price += ~~$('.bodytype_price').text();







    if ($('.item_forceps').val() === 'Yes')
        price += ~~$('.forceps_price').text();







    if ($('.item_adapter').val() === 'Yes')
        price += ~~$('.adapter_price').text();




    $('.item_price').html(simpleCart.toCurrency(price));
}

function add_option(options, item, name, label) {
    var itemValue = item.get(name)
    if (itemValue && (itemValue !== 'No') && (itemValue !== 'Нет')) {
        if (options !== '')
            options += '<br/>';
        options += label + ': <strong>' + itemValue + '</strong>';
    }
    return options;
}

simpleCart({
    currency: 'USD',

    checkout: {
        type: 'PayPal',
        email: 'svetlany@gmail.com',
        success: 'thank-you-for-purchase/'
        //type: 'SendForm' ,
        //url: 'http://argodoll.pythonanywhere.com/order/',
        //success: 'thank-you-for-order/'
    },
    cartColumns: [
        { view: function(item, column) {
                return '<a href="' + item.get('url') + '"><img src="' + item.get('thumb') + '"></a>';
            }, attr: 'thumb', label: false},
        { view: function(item, column) {
                return '<a href="' + item.get('url') + '">' + item.get('name') + '</a>';
            }, attr: 'name', label: 'Doll' },
        { view: function(item, column) {
                var options = '';
                for (i in optionLabels) {
                    var info = optionLabels[i];
                    options = add_option(options, item, info.name, info.label);
                }
                return options;
            }, attr: 'custom', label: 'Options'},
        { view: function(item, column) {
                var discount = item.get('discount');
                return (discount > 0) ? (simpleCart.currency().symbol + discount) : '';
            }, attr: 'thumb', label: 'Discount'},
        { view: 'currency', attr: 'price', label: 'Price'},

        { view: 'input', attr: 'quantity', label: 'Quantity'},
        { view: 'remove', text: '<span class="glyphicon glyphicon-remove btn btn-default btn-xs" aria-hidden="true"></span>', label: false}
    ],

    cartStyle: 'table',
    excludeFromCheckout: ['thumb','url','package','category','original_price','discount'],

    shippingCustom: function(){
        var total = 0;
        var quantity = new Uint32Array(shippingPrices.length);
        simpleCart.each( function( item ){
            var package = item.get('package');
            for (i in shippingPrices) {
                if (shippingPrices[i].package == package) {
                    quantity[i] += item.quantity();
                    return;
                }
            }
        });
        for (i in quantity) {
            var info = shippingPrices[i];
            var batchCount = Math.floor(quantity[i] / info.batch);
            var remainder = quantity[i] % info.batch;
            total += batchCount * (info.base + (info.batch - 1) * info.add);
            if (remainder > 0)
                total += info.base + (remainder - 1) * info.add;
        }
        return total * 1;
    }
});



isShippingEnabled = function() {
    var enabled = false;
    simpleCart.each(function (item) {
        var package = item.get('package');
        if ((package === 'small') || (package === 'big'))
            enabled = true;
    });
    return enabled;
}

clearDiscounts = function() {
    simpleCart.each(function (item) {
        item.set('discount', 0);
        item.price(item.get('original_price'));
    });
}

isSmallDoll = function(item) {
    return item.get('category') === 'dolls-small';
}

discountManySmallDolls = function() {
    var count = 0;
    simpleCart.each(function (item) {
        if (isSmallDoll(item))
            count += item.quantity();
    });
    simpleCart.each(function (item) {
        var discount = (count > 1) && isSmallDoll(item) ? 40 : 0;
        item.set('discount', discount);
        item.price(item.get('original_price') - discount);
    });
}

$(document).ready(function() {

    $('a, img:not(.reel)').mousedown(function() { return false });

    $('a[href^="#"]').click(function (e) {
        e.preventDefault();

        var hash = this.hash;
        var target = $(hash);
        var height = $(window).height();
        var delta = target.offset().top - $(document).scrollTop();
        if (Math.abs(delta) > height)
            $(window).scrollTop(target.offset().top - Math.sign(delta) * height);

        $('html, body').stop().animate({
            'scrollTop': target.offset().top
        }, 500, 'easeOutQuart', function () {
            window.location.hash = hash;
        });
    });

    $('.price').change(calculatePrice);
    calculatePrice();

    simpleCart.bind('update', function() {
        var count = 0;
        simpleCart.each(function (item) {
            count += item.quantity();
        });
        var cart = $('#cart');
        var empty = $('#cart-empty');
        var sign = $('#cart-sign');
        var badge = $('#cart-badge');
        if (count > 0) {
            cart.show();
            empty.hide();
            sign.hide();
            badge.show();
            badge.html(count);
        } else {
            cart.hide();
            empty.show();
            sign.show();
            badge.hide();
        }

        var checkout = $('#checkout');
        var noCheckout = $('#no-checkout');
        if (isShippingEnabled()) {
            checkout.show();
            noCheckout.hide();
        } else {
            checkout.hide();
            noCheckout.show();
        }

        // calculate discounts
        clearDiscounts();
        //discountManySmallDolls();
    });

    simpleCart.bind('beforeCheckout', function() {
        return isShippingEnabled();
    });

    simpleCart.bind('beforeAdd', function(item){
        item.set('original_price', item.price());
    });

    simpleCart.bind('afterAdd', function(item){

        $('.item_add').addClass('hidden')
        $('.go-to-cart').removeClass('hidden')

        var cart = $('#cart_link')
        var preview = $('#doll_preview')

        var clone = preview.clone()
        .offset({
            top: preview.offset().top,
            left: preview.offset().left
        })
        .width(preview.width())
        .height(preview.height())
        .css({
            'position': 'absolute',
            'z-index': '2000'
        })
        .appendTo($('body'))
        .animate({
            'top': cart.offset().top + 10,
            'left': cart.offset().left + 10,
            'width': preview.width() / 5,
            'height': preview.height() / 5
        }, 1000, 'easeInOutExpo')
        .animate({ 'width': 0, 'height': 0 }, function () {
            $(this).detach();
        });

        cart
        .delay(1200)
        .animate({ 'opacity':'toggle' }, 200)
        .animate({ 'opacity':'toggle' }, 200);
    });


    var language = navigator.language || navigator.userLanguage;
    if (language.toLowerCase().indexOf('ru') == 0)
        $('#russian-site').show();


});
