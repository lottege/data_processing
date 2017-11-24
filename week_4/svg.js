d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
    document.getElementById("kleur1").style.fill = "#ccece6";
    document.getElementById("kleur2").style.fill = "#99d8c9";
    document.getElementById("kleur3").style.fill = "#66c2a4";
    document.getElementById("kleur4").style.fill = "#41ae76";
    document.getElementById("kleur5").style.fill = "#238b45";
    document.getElementById("kleur6").style.fill = "#005824";
});

