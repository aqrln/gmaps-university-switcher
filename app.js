(function () {
  var universities = [
    {
      name: "НТУУ КПІ",
      position: {
        lat: 50.44906,
        lng: 30.46072
      },
      zoom: 16
    },
    {
      name: "КНУ ім. Шевченка",
      position: {
        lat: 50.44175,
        lng: 30.50897
      },
      zoom: 18
    }
  ];

  var currentUniversity = 0;
  var inEditMode = false;
  var editModePosition = null;

  var map = null;
  var marker = null;

  function loadUniversity(universityIndex) {
    var university = universities[universityIndex];
    $('#university-name').text(university.name);
    map.setCenter(university.position);
    map.setZoom(university.zoom);
    marker.setPosition(university.position);
  }

  function switchUniversity(direction) {
    if (inEditMode) {
      exitEditMode();
    }
    switch (direction) {
      case 'left':
        currentUniversity--;
        if (currentUniversity < 0) {
          currentUniversity = universities.length - 1;
        }
        loadUniversity(currentUniversity);
        break;

      case 'right':
        currentUniversity++;
        if (currentUniversity >= universities.length) {
          currentUniversity = 0;
        }
        loadUniversity(currentUniversity);
        break;

      default:
        console.error('switchUniversity: invalid direction')
    }
  }

  function enterEditMode() {
    inEditMode = true;
    $('.center').css('margin-top', -180);
    $('#edit-form-textfield').focus();
  }

  function exitEditMode() {
    inEditMode = false;
    $('.center').css('margin-top', 0);
    $('#edit-form-textfield').val('');
  }

  function onMapClick(event) {
    var position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    editModePosition = position;
    if (!inEditMode) {
      enterEditMode();
    }
  }

  function newUniversity() {
    var name = $('#edit-form-textfield').val();
    var university = {
      name: name,
      position: editModePosition,
      zoom: map.getZoom()
    };
    console.log(university);
    currentUniversity = universities.push(university) - 1;
    loadUniversity(currentUniversity);
    exitEditMode();
  }

  $(document).ready(function () {
    var mapOptions = {
      center: universities[0].position,
      zoom: universities[0].zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    marker = new google.maps.Marker({position: universities[0].position, map: map});

    loadUniversity(currentUniversity);

    $('#left-arrow').click(function () {
      switchUniversity('left');
    });

    $('#right-arrow').click(function () {
      switchUniversity('right');
    });

    $('#edit-form').submit(function (event) {
      event.preventDefault();
      newUniversity();
    });

    google.maps.event.addListener(map, 'click', onMapClick);
  });
})();