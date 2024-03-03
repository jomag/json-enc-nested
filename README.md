# htmx extension: json-enc-nested

This extension builds on the official json-enc extension by adding
support for nested attributes using bracket syntax:

```html
<form hx-ext="json-enc-nested">
  <input name="color" value="green"/>
  <input name="properties[foo]" value="bar"/>
  <input name="properties[zoo][boo]" value="42"/>
  <input type="submit">
</form>
```

On submit, the payload will be sent as JSON:

```json
{
  "color": "green",
  "properties": {
    "foo": "bar",
    "zoo": {
      "boo": 42
    }
  }
}
```

