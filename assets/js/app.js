var socket = io.connect('http://gix.local:7000');
var instruments;
$(document).on('vclick', '#instruments li a', function(){  
	var ipath = $(this).attr('data-inum');
	var iname = $(this).text();
	console.log(iname + ': ' + ipath);
	socket.emit('message', ipath);
	$('#instruments li a').removeClass('ui-btn-active');
	$(this).addClass('ui-btn-active');
});
socket.on('connect', function(data) {
	$.mobile.loading( 'show', { text: 'pouring fluid', textVisible: true });
	socket.emit('message', 'client connected');
	socket.on('instrumentdump', function(idmp){
		var str = idmp.package;
		var instruments = str.split("\n");
		for (i=0;i < instruments.length; i++) {
			console.log(instruments[i].slice(4));
			var instrumentnumber = instruments[i].slice(4,7);
			var instrumentname = instruments[i].slice(8);
			$('#instruments').append('<li data-icon="audio"><a href="#" data-inum="' + instrumentnumber + '">' + instrumentname + '</a></li>').enhanceWithin();
		} 
		$("#instruments").listview("refresh");
		$.mobile.loading( 'hide');
	});
});
socket.on('reconnecting', function() {
    $.mobile.loading( 'show', { text: 'finding fluid', textVisible: true });
})
function getinstruments(){
	socket.emit('message', 'list');
	socket.on('current', function(icur){
		instruments = icur.package;
		console.log(instruments);  
	});
}