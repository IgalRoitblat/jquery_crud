var inputs = [
	{tag: "input", type: "text", name: "subject", placeholder: "enter email subject here"},
	{tag: "input", type: "text", name: "from", placeholder: "enter your name here"},
	{tag: "textarea", name: "body", cols: 83, rows: 10, placeholder: "Enter email body here"},
	{tag: "input", type: "text", name: "id", placeholder: "enter email id"},
	{tag: "input", type: "date", name: "date"}

];

getEmails();
$(".compose").click(composeEmail);


function getEmails() {
	$.get('/mails', function(emails) {
		$(".email-list").empty();
		emails.forEach(email => {
			showPreview(email);
		})
	});
}

function composeEmail() {
	$(".main_content").empty();
	$(".main_content").append(
		$("<h3>", {text: "Create New Email"}),
		$("<form>"));
	showInputs();
	$("form").append(
		$("<input>", {type: "submit"})).submit(function(e) {
		e.preventDefault();
		$.post('/mails', getFormData() ,function() {
			$(".main_content").empty();
			getEmails();
		})
	})
}

function editEmail(email) {
	$(".main_content").empty();
	$(".main_content").append(
		$("<h3>", {text: "Edit Email"}),
		$("<form>"));
		showInputs(email);
		$("form").append(
			$("<input>", {type: "submit", value: "Save"})).submit(function(e) {
			e.preventDefault();
			$.ajax({
				url: "/mails/" + email.id,
				method: "put",
				data: getFormData(),
				success: function() {
					getEmails();
				}
			});
			$(".main_content").empty();
		})
}

function deleteEmail(email) {
	$.ajax({
		url: "/mails/" + email.id,
		method: "delete",
		success: function() {
			$(".main_content").empty();
			getEmails();
		}
	});
}

function getFormData() {
	return {
		id: $("input[name=id]").val(),
		body: $("textarea").val(),
		subject: $("input[name=subject]").val(),
		from: $("input[name=from]").val(),
		date: $("input[name=date]").val()
	}
}

function showPreview(email) {
	$("<li>").html(
		"<strong>from:</strong> " + email.from + " <strong>subject:</strong> " + email.subject + " <strong>Body:</strong> " + email.body.slice(0, 15) + "...").addClass("email").appendTo(".email-list").click(function() {showEmail(email)})
}

function showEmail(email) {
	$(".main_content").empty();
	$(".main_content").append(
		$("<h3>", {text: email.subject}),
		$("<p>", {text: email.body}), $("<span>", {text: email.date}),
		$("<div>").append(
			$("<button>", {text: "edit", class: "green"}).click(function() {editEmail(email)}),
			$("<button>", {text: "delete", class: "red"}).click(function() {deleteEmail(email)})
		)
	);
}

function showInputs(email = {}) {
		inputs.forEach(input => {
			if (input.tag == "textarea") {
				$("form").append(
					$("<" + input.tag + ">", {
						type: input.type,
						name: input.name,
						placeholder: input.placeholder,
						rows: input.rows,
						cols: input.cols,
						text : email[input.name]
					}))
			} else {
				$("form").append(
					$("<" + input.tag + ">", {
						type: input.type,
						name: input.name,
						placeholder: input.placeholder,
						value: email[input.name]
					}))
			}
		});
}

