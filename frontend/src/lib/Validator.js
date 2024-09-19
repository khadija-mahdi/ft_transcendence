export class Validator {
	constructor() {
		this.rules = [];
	}

	required(message = "this field is required") {
		this.rules.push((value) => (value ? null : message));
		return this;
	}

	min(length) {
		this.rules.push((value) =>
			value.length >= length
				? null
				: `this field must be at least ${length} characters`
		);
		return this;
	}

	max(length) {
		this.rules.push((value) =>
			value.length <= length
				? null
				: `this field must be less than ${length} characters`
		);
		return this;
	}

	string(message = "this field must be a string") {
		this.rules.push((value) => (typeof value === "string" ? null : message));
		return this;
	}

	oneOf(input_id, message = "value does not match") {
		const input = document.getElementById(input_id);
		this.rules.push((value) => (value === input.value ? null : message));
		return this;
	}

	matches(regex, message = "this field does not match the regex") {
		this.rules.push((value) => (value.match(regex) ? null : message));
		return this;
	}

	email(message = "this field must be a valid email") {
		this.rules.push((value) =>
			value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
				? null
				: message
		);
		return this;
	}

	costume(fn) {
		this.rules.push(fn);
		return this;
	}

	validate(value) {
		for (let rule of this.rules) {
			const error = rule(value);
			if (error) return error;
		}
		return null;
	}
}

function validateSchema(schema, formData) {
	let helperText = null;
	let input = null;
	let failed = false;
	for (let key in schema) {
		helperText = document.getElementById(`${key}-error-text`);
		input = document.getElementById(key);
		const error = schema[key].validate(formData[key]);
		if (helperText) helperText.innerText = error ? error : "";
		if (input)
			input.style.border = error ? "1px solid red" : "1px solid green";
		failed = failed || error;
	}
	return failed;
}

export function handleSubmit(event, schema = {}, OnSubmit = () => { }) {
	event.preventDefault();
	const data = {};
	for (let element of event.target.elements) {
		if (element.name) data[element.name] = element.value;
	}

	if (validateSchema(schema, data)) {
		return;
	}
	OnSubmit(data, schema);
}

export function reset(schema) {
	for (let key in schema) {
		const helperText = document.getElementById(`${key}-error-text`);
		const input = document.getElementById(key);
		if (helperText) helperText.innerText = "";
		input.style.border = "none";
		input.value = "";
	}
}
