$(document).ready(function()
{
	$("#ok_login").click(function(){
		var pass = $("#pass").val();
		console.log(pass);
		$.post('/login',{pass:pass},function(response, textStatus){
			window.location.href='/dashboards';
		});
	});
});
