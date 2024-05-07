// load json function
/*
Kommentar als kleine Änderung von mir
*/
function loadColors() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var recordCount = 0;
      var records = JSON.parse(this.responseText);
      var newInnerHTML = "";

      // process records
      records.forEach(function (record, index) {
        // get id and skip blank ids
        var id = String(record.id).trim();
        if (id == "") return;
        // get RGB color values
        var r = colorValue(record.color.r);
        var g = colorValue(record.color.g);
        var b = colorValue(record.color.b);
        // set HTML output
        newInnerHTML += recordAsHTML(id, r, g, b);
        // count records found
        recordCount++;
      });
      // message for no records
      if (recordCount == 0) newInnerHTML = "No colors found! 😭";

      // replace content
      document.getElementById("colorRecords").innerHTML = newInnerHTML;
    }
  };
  xmlhttp.open("GET", "data/colors.json?t=" + Date.now(), true);
  xmlhttp.send();
}

// choose color functions

function handleColorChange(e) {
  var value = colorValue(e.value);
  if (e.value != value.toString()) e.value = value;
  updateColorPreview();
}

function handleRandomColor(e) {
  // limit random values between min and max
  const min = 50; // 0
  const max = 255; // 255
  document.getElementById("r").value = colorValue(
    Math.floor(Math.random() * (max - min)) + min,
  );
  document.getElementById("g").value = colorValue(
    Math.floor(Math.random() * (max - min)) + min,
  );
  document.getElementById("b").value = colorValue(
    Math.floor(Math.random() * (max - min)) + min,
  );
  updateColorPreview();
}

function updateColorPreview() {
  var r = colorValue(document.getElementById("r").value);
  var g = colorValue(document.getElementById("g").value);
  var b = colorValue(document.getElementById("b").value);
  var color = RGBColorValue(r, g, b);
  var title = titleAttribute("Preview", color);
  var element = document.getElementById("colorPreview");
  element.style["background-color"] = color;
  element.title = title;
  document.getElementById("colorPreviewJson").innerHTML = recordAsJSON(r, g, b);
}

// helper functions

function RGBColorValue(r, g, b) {
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function titleAttribute(id, color) {
  return escapeHTML(id) + "\n" + escapeHTML(color);
}

function recordAsHTML(id, r, g, b) {
  var color = RGBColorValue(r, g, b);
  var title = titleAttribute(id, color);
  return (
    '<span title="' +
    title +
    '" style="background-color: ' +
    color +
    '"></span>'
  );
}

function recordAsJSON(r, g, b) {
  return '"color": { "r": ' + r + ', "g": ' + g + ', "b": ' + b + " }";
}

function escapeHTML(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

function colorValue(value) {
  var x = parseInt(value) || 0;
  return x < 0 ? 0 : x > 255 ? 255 : x;
}
