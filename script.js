(function($){

    $.fn.shuffle = function() {

        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });

        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });

        return $(shuffled);

    };

})(jQuery);

$(function() {
    $('body').on('click', '.btn__action', function() {
        const action = $(this).data('action')

        switch (action) {
            case 'start':
                fromBeginning()
                break
            case 'show_popup':
                showPopup()
                break
            case 'close_popup':
                hidePopup()
                break
        }
    })

    init()

    function init() {
        $.ajaxSetup({ async: false });

        const $places = $('.places:not(.example)')
        const lang    = 'ru'
        let letters   = {};

        $.getJSON( './json/hebrew.json', function(data) {
            letters = data
        });

        $.getJSON( `./json/${lang}.json`, function(data) {
            $.each(data, function(key, val) {
                // key - alef
                // val - Alef

                letters[key].name = val
            })
        });

        $.each(letters, function(key, val) {
            // key - alef
            // val.symbol - א
            // val.name - Alef

            const symbol        = val.symbol
            const name          = val.name

            const $place        = $('<div></div>').addClass('place')
            const $placeName    = $('<div></div>').addClass('place_name').text(name)
            const $placeHolderP = $('<div></div>').addClass('place_holder achieved printed').data('place', key).data('type', 'printed')
            const $placeHolderH = $('<div></div>').addClass('place_holder achieved handwritten').data('place', key).data('type', 'handwritten')
            const $letterP      = $('<div></div>').addClass('letter printed').text(symbol).data('is', key).data('type', 'printed')
            const $letterH      = $('<div></div>').addClass('letter handwritten').text(symbol).data('is', key).data('type', 'handwritten')

            $placeHolderP.append($letterP)
            $placeHolderH.append($letterH)
            $place.append($placeName, $placeHolderP, $placeHolderH)
            $places.append($place)
        })
    }

    $('body').on('click', '.letter', function() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')

            return
        }

        $('.letter.selected').removeClass('selected')
        $(this).addClass('selected')
    })

    $('body').on('click', '.place_holder', function() {
        if ($(this).hasClass('achieved')) return

        const $letter = $('.letter.selected')

        if (0 === $('.letter.selected').length) return // show message "Choose letter first"

        const placeType  = $(this).data('type')
        const placeKey   = $(this).data('place')
        const letterType = $letter.data('type')
        const letterKey  = $letter.data('is')

        if ( placeType !== letterType || placeKey !== letterKey ) wrongChoice()
        else rightChoice($(this))
    })

    function fromBeginning() {
        const $letters = $('.letters')

        $('.places .letter').each(function() {
            $letters.append($(this))
        })

        $('.letters .letter').shuffle()

        $('.letter.selected').removeClass('selected')

        $('.place_holder.achieved').removeClass('achieved')
    }

    function wrongChoice() {
        $('body').removeClass('wrong_choice right_choice animate_choice').addClass('wrong_choice animate_choice')
    }

    function rightChoice($place) {
        const $letter = $('.letter.selected')

        $place.append($letter)

        $place.addClass('achieved')
        $letter.removeClass('selected')
        $('body').removeClass('wrong_choice right_choice animate_choice').addClass('right_choice animate_choice')
    }

    function showPopup() {
        $('body').addClass('popup__show')
    }

    function hidePopup() {
        $('body').removeClass('popup__show')
    }
});