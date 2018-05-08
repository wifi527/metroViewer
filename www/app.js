console.log( 'app.js' );

document.addEventListener('deviceready', function() {
    // erst jetzt ist APP geladen und ready um was zu tun!
    console.log( 'DEVICE READY!' );

  // GMAP (Fullscreen zeigt Wien)
  var map = new google.maps.Map( $('#map').get(0), {
    center:{lat:48.211,lng:16.377},
    zoom:10
  } );

    // U-Bahnen
    $.ajax({
      url:'http://wifi.1av.at/527/ubahnen.php',
      success:function(d) {

        console.log( d );
        var lines = [
          ['U1','#e20613'],
          ['U2','#a762a3'],
          ['U3','#ee7d00'],
          ['U4','#009540'],
          ['U6','#9d6930'],
        ]


        for ( var j in lines ) {
          var stationen = [];
          var image = {
            url: 'img/'+lines[j][0]+'.png',
            scaledSize: new google.maps.Size(12, 12),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(6, 6) // anchor
          };

          for ( var i in d[ lines[j][0] ].haltestellen ) {
            var latlng = {
              lat:d[ lines[j][0] ].haltestellen[i].lat,
              lng:d[ lines[j][0] ].haltestellen[i].lng
            };

            stationen.push(latlng);

            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              icon: image
            });
          }

          var metroPath = new google.maps.Polyline({
            path: stationen,
            geodesic: true,
            strokeColor: lines[j][1],
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

          metroPath.setMap(map);

          }

      }

    })


    // U-Bahn Haltestellen in GMAP mit Icons
    // Pfade zwischen U-Bahn Haltestellen in richtiger Farbe
    // #e20613
    // #a762a3
  	// #ee7d00
    // #009540
    // #9d6930

    // Klick auf Station > Info in Echtzeit (Wienerlinien)

    //http://wifi.1av.at/527/ubahnen.php -> liefert JSON

    //http://data.wien.gv.at/pdf/wienerlinien-echtzeitdaten-dokumentation.pdf

    //http://www.wienerlinien.at/ogd_realtime/monitor?rbl=4623&sender=LndqkyecPrAmUu5Q


    // --- spezial --- fahrende Ubahnen in Map


});
