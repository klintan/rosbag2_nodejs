let sqlite3 = require('sqlite3');
let RosbagDeserializer = require('../build/Release/rosbags2_nodejs.node');
let fs = require("fs");


const deserializer = new RosbagDeserializer.Rosbag2Wrapper();

let dataDir = "/Users/andreasklintberg/personal/rosbag2_nodejs/examples/sample.db3";

db = new sqlite3.Database(dataDir);


/* Text */
const textId = 1;
db.serialize(function () {
  db.get("SELECT data FROM messages WHERE id=$textId", {
    $textId: textId
  }, function (err, res) {
    const uint8Message = new Uint8Array(res['data']);
    /* deserializeMessage functions takes arguments: binary message data, ros message type, topic */
    console.log("deserialized message", deserializer.deserializeMessage(uint8Message, "std_msgs/String", "string_topic"));
  });
});

/* Image */
const imageId = 2;
db.serialize(function () {
  db.get("SELECT data FROM messages WHERE id=$imageId", {
    $imageId: imageId
  }, function (err, res) {
    const uint8Message = new Uint8Array(res['data']);
    /* deserializeMessage functions takes arguments: binary message data, ros message type, topic */
    let base64_image = deserializer.deserializeMessage(uint8Message, "sensor_msgs/Image", "image_topic");

    let html_string = "<img src=\"data:image/png;base64, "+ base64_image + "\"/>";

    fs.writeFile("image.html", html_string, function(err, html_string) {
      if (err) console.log(err);
      console.log("Successfully created base64 image html.");
    });
  });
});
