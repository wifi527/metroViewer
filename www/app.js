console.log( 'app.js' );

var ubahnenJSON = {};
var lines = [
  ['U1','#e20613'],
  ['U2','#a762a3'],
  ['U3','#ee7d00'],
  ['U4','#009540'],
  ['U6','#9d6930'],
];
var drawLines = function(map) {
  for ( var j in lines ) {
    var stationen = [];
    for ( var i in ubahnenJSON[ lines[j][0] ].haltestellen ) {
      var latlng = {
        lat:ubahnenJSON[ lines[j][0] ].haltestellen[i].lat,
        lng:ubahnenJSON[ lines[j][0] ].haltestellen[i].lng
      };

      stationen.push(latlng);
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

var showInfo = function( hs ) {
  var d = $( '<div id="info">' ).appendTo( 'body' ).on( 'click', function() { $(this).remove(); });

  $.ajax({
    url:'http://www.wienerlinien.at/ogd_realtime/monitor',
    data:{rbl:hs.steigH,sender:'LndqkyecPrAmUu5Q'},
    success:function(res) {
        html = 'Abfahrten nach '+res.data.monitors[0].lines[0].towards+' in:<br>';
        for ( c in res.data.monitors[0].lines[0].departures.departure ) {
          html+= res.data.monitors[0].lines[0].departures.departure[c].departureTime.countdown +'min<br>'
        }
        d.append( $('<p>').html( html ) );
    }
  });

$.ajax({
  url:'http://www.wienerlinien.at/ogd_realtime/monitor',
  data:{rbl:hs.steigR,sender:'LndqkyecPrAmUu5Q'},
  success:function(res) {
      html = 'Abfahrten nach '+res.data.monitors[0].lines[0].towards+' in:<br>';
      for ( c in res.data.monitors[0].lines[0].departures.departure ) {
        html+= res.data.monitors[0].lines[0].departures.departure[c].departureTime.countdown +'min<br>'
      }
      d.append( $('<p>').html( html ) );
  }
})

}

var allStationMarker = [];
var setStations = function( map, zoom ) {
  for ( var a in allStationMarker ) {
    allStationMarker[a].setMap( null );
  }
  if ( zoom < 12 ) return;
  for ( var j in lines ) {
    var image = {
      url: 'img/'+lines[j][0]+'.png',
      scaledSize: new google.maps.Size(12, 12),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(6, 6) // anchor
    };

    for ( var i in ubahnenJSON[ lines[j][0] ].haltestellen ) {
      var latlng = {
        lat:ubahnenJSON[ lines[j][0] ].haltestellen[i].lat,
        lng:ubahnenJSON[ lines[j][0] ].haltestellen[i].lng
      };
      var m = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: image
      });
      m.hs = ubahnenJSON[ lines[j][0] ].haltestellen[i];

      allStationMarker.push( m );

      m.addListener('click', function() {
        showInfo( this.hs );
      });
    }
  }

}


document.addEventListener('deviceready', function() {
    // erst jetzt ist APP geladen und ready um was zu tun!
    console.log( 'DEVICE READY!' );

  // GMAP (Fullscreen zeigt Wien)
  var zoom = 10;
  var map = new google.maps.Map( $('#map').get(0), {
    center:{lat:48.211,lng:16.377},
    zoom:zoom
  } );
  google.maps.event.addListener(map, 'zoom_changed', function() {
    zoom = map.getZoom();
    setStations( map, zoom );
  });


    // U-Bahnen
    $.ajax({
      url:'http://wifi.1av.at/527/ubahnen.php',
      success:function(d) {
        ubahnenJSON = d;
        drawLines( map );
        setStations( map, zoom );
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
