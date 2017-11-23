d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
    document.getElementById("kleur1").style.fill = "blue";
    document.getElementById("kleur2").style.fill = "red";
    document.getElementById("kleur3").style.fill = "green";
});

