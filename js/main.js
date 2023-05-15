$(document).ready(function() {
    var inputs1 = $("#pc1").find($("label") );
    var inputs2 = $("#pc2").find($("label"));
    var totalDuration1 = animateLabels(inputs1, 0);
    var totalDuration2 = animateLabels(inputs2, totalDuration1);
    var totalDuration = totalDuration1 + totalDuration2-2000;

    setTimeout(function() {
        $('#progress').fadeOut();
        $('#start').fadeIn();
        $("#bgm_start")[0].play();
    }, totalDuration);

    function animateLabels(inputs, initialDelay) {
        var totalDuration = initialDelay;
        for(var i = 0; i < inputs.length; i++) {
            var index = i + 1;
            var time = ((inputs.length) - i) * 50;
            totalDuration += time;
            $(inputs[i]).css("-animation", "anim 3s " + (initialDelay + time) + "ms ease-in-out");
        }
        setTimeout(function() {
            $("#sound_progress")[0].play();
        }, (initialDelay + time));

        return totalDuration;
    }
});


