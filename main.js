/**
 * This function removes a channel from the local storage, where this program store its stream names.
 * @param {string} channel
 * @returns {undefined}
 */
function removeChannel(channel) {
	var arr = localStorage.getItem("streams").split(",");
	arr = arr.filter(param => {
		return param !== channel;
	});
	localStorage.setItem("streams", arr);
}

/**
 * This function adds the channel to the local storage.
 * @param {string} channel
 * @return {undefined}
 */
function addChannel(channel) {
	var arr = localStorage.getItem("streams") ? localStorage.getItem("streams").split(",") : [];
	if (arr.indexOf(channel) < 0) arr.push(channel);
	localStorage.setItem("streams", arr);
}
/**
 * @returns {Array} all channels stored in the browser.
 */
function getAllChannels() {
	var arr = localStorage.getItem("streams") ?  localStorage.getItem("streams").split(","): [];
	return arr;
}
/**
 * This function inserts a stream into the html page.
 * @param {string} channel 
 */
function getChannelInfo(channel) {
	addChannel(channel);
	var url = "https://wind-bow.glitch.me/twitch-api/";
	$.getJSON(url + "/channels/" + channel + "?callback=?", function (data) {
		var html = "";
		html += "<div class='card' id='" + channel + "' status=''>";
		html += "<div class='card-header'><h3>" + channel + "</h3></div>";
		html += "<div class='card-body'>";
		html += "<input class='delete btn btn-danger' type='button' value='X'>";
		if (data.error) {
			html += "<b>Channel not found!</b>";
		} else {
			html += "<img src=" + (data.logo ? data.logo : "https://www.mautic.org/media/images/default_avatar.png") + " alt='Stream logo'><br>";
			html += "Link: <a href=" + data.url + ">" + data.url + "</a><br>";
			html += "<span class='status'>Status: </span>";
		}
		html+= "<span class='description hidden'></span>";
		html += "</div></div>";
		$("body").append(html);
		$.getJSON(url + "/streams/" + channel + "?callback=?", function (data) {
			var x = document.getElementById(channel);
			var status;
			if (data.stream == null) {
				$(x).find(".status").html("Status: <b style='color:tomato'>Offline</b><br>");
				status = "Offline";
			} else {
				$(x).find(".status").html("Status: <b style='color:MediumSeaGreen'>Online</b><br>");
				status = "Online";
				$(x).find(".description").html("<b>" + data.stream.game + " - " +data.stream.channel.status+ "</b>");
			}
			$("#" + channel).prop("status", status);
		});
	});
}

$(document).ready(function () {
	/**
 	* If the local storage don't have any channel, reset it with the defaults.
 	*/
	var channelnames = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
	if (localStorage.getItem("streams"))
		channelnames = getAllChannels();
	channelnames.forEach(function (item) {
		getChannelInfo(item);
	});
	$(document).on("click", ".delete", function () {
		removeChannel($(this).parent().parent().prop("id"));
		$(this).parent().parent().remove();
	});
	$(document).on("click", "#insert", function () {
		if ($("#channel").val() !== "") {
			getChannelInfo($("#channel").val().replace(/[^A-Za-z0-9]/g, ""));
			$("#channel").val("");
		}

	});
	$(document).on("change", "input:radio", function () {
		switch ($(this).prop("value")) {
			case "All":
				$(document.body).children(".card").each(function () {
					$(this).show();
				});
				break;
			case "Online":
				$(document.body).children(".card").each(function () {
					if ($(this).prop("status") !== "Online") {
						$(this).hide();
					}
					else {
						$(this).show();
					}
				});
				break;
			case "Offline":
				$(document.body).children(".card").each(function () {
					if ($(this).prop("status") !== "Offline") {
						$(this).hide();
					}
					else {
						$(this).show();
					}
				});
				break;
		}
	});
});