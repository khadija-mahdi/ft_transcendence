export class Validator {
    constructor() {
        this.rules = []
    }

    required() {
        this.rules.push((value) => (value ? null : 'this field is required'));
        return this;
    }

    min(length) {
        this.rules.push((value) => (value.length >= length ? null : `this field must be at least ${length} characters`));
        return this;
    }

    max(length) {
        this.rules.push((value) => (value.length <= length ? null : `this field must be less than ${length} characters`));
        return this;
    }

    string() {
        this.rules.push((value) => (typeof value === 'string' ? null : 'this field must be a string'));
        return this;
    }


    costume(fn) {
        this.rules.push(fn);
        return this;
    }

    validate(value) {
        for (let rule of this.rules) {
            const error = rule(value);
            if (error)
                return error;
        }
        return null;
    }
}

function validateSchema(schema, formData) {
    let helperText = null;
    let input = null;
    let failed = false
    console.log("Schema: ", schema, 'FormData: ', formData);
    for (let key in schema) {
        helperText = document.getElementById(`${key}-error-text`);
        console.log("HelperText: ", helperText);
        input = document.getElementById(key);
        const error = schema[key].validate(formData[key]);
        if (helperText)
            helperText.innerText = error ? error : '';
        input.style.border = error ? '1px solid red' : '1px solid green';
        console.log("Error: ", error, 'key: ', key);
        failed = failed || error;
    }
    return failed;
}

export function handleSubmit(event, schema = {}, OnSubmit = () => { }) {
    event.preventDefault();
    const data = {}
    for (let element of event.target.elements) {
        if (element.name)
            data[element.name] = element.value;
    }

    if (validateSchema(schema, data)) {
        return;
    }
    OnSubmit(data);
}