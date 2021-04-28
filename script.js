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
    // $.getJSON( './json/hebrew.json', function(data) {
    //     const $places  = $('.places:not(.example)')

    //     $.each(data, function(key, val) {
    //         // key - alef
    //         // val.symbol - א
    //         // val.name - Alef

    //         const symbol        = val.symbol
    //         const name          = val.name

    //         const $place        = $('<div></div>').addClass('place')
    //         const $placeName    = $('<div></div>').addClass('place_name').text(name)
    //         const $placeHolderP = $('<div></div>').addClass('place_holder riched printed').data('place', key).data('type', 'printed')
    //         const $placeHolderH = $('<div></div>').addClass('place_holder riched handwrited').data('place', key).data('type', 'handwrited')
    //         const $letterP      = $('<div></div>').addClass('letter printed').text(symbol).data('is', key).data('type', 'printed')
    //         const $letterH      = $('<div></div>').addClass('letter handwrited').text(symbol).data('is', key).data('type', 'handwrited')

    //         $placeHolderP.append($letterP)
    //         $placeHolderH.append($letterH)
    //         $place.append($placeName, $placeHolderP, $placeHolderH)
    //         $places.append($place)
    //     })
    // });

    $('body').on('click', '.btn__start', function() {
        fromBegining();
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
            const $placeHolderP = $('<div></div>').addClass('place_holder riched printed').data('place', key).data('type', 'printed')
            const $placeHolderH = $('<div></div>').addClass('place_holder riched handwrited').data('place', key).data('type', 'handwrited')
            const $letterP      = $('<div></div>').addClass('letter printed').text(symbol).data('is', key).data('type', 'printed')
            const $letterH      = $('<div></div>').addClass('letter handwrited').text(symbol).data('is', key).data('type', 'handwrited')

            $placeHolderP.append($letterP)
            $placeHolderH.append($letterH)
            $place.append($placeName, $placeHolderP, $placeHolderH)
            $places.append($place)
        })
    }

    function fromBegining() {
        const $letters = $('.letters')

        $('.places .letter').each(function() {
            $letters.append($(this))
        })

        $('.letters .letter').shuffle()

        $('.letter').each(function() {
            makeDraggable(this)
        })

        $('.place_holder.riched').each(function() {
            const type  = $(this).data('type')
            const place = $(this).data('place')

            makeDroppable(this, place, type)

            $(this).removeClass('riched')
        })
    }

    function makeDraggable(elem) {
        $(elem).draggable({
            cursor: 'move',
            revert: 'invalid',
        })
    }

    function makeDroppable(elem, place, type) {
        $(elem).droppable({
            // tolerance: 'fit',
            accept: function(draggable) {
                if (place != $(draggable).data('is')) return false
                if (type != $(draggable).data('type')) return false

                return true
            },
            drop: function(event, ui) {
                $(this).addClass('riched').droppable('destroy')
                $(ui.draggable[0]).draggable('destroy').css({
                    'position': '',
                    'left': '',
                    'top': '',
                })

                $(this).append($(ui.draggable[0]))
            },
        })
    }
});