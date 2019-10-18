# Bitbucket App

## Custom Bitbucket Pulls Sort

Sort Github Pulls using regular expressions. Use it by adding an `order` object in your github-pulls app inside `palantir.json` config file.

Accept an array of regular expressions to be used in sorting. Regular expressions can be specified using either:
- a string, in this case a default `gi` modifier is used.
- an array, using this model: Array[pattern, modifier].
- a wildcard `*` to negate all other regular expressions inside your array.

### Example

```
"pulls": {
  "type": "github-pulls",
  "config": {
    "token": "#{github-token}",
    "order": [
      "^\\[fastlane\\]",
      "*",
      "^\\[wip\\]"
      ],
    "repositories": {
      ...
    }
  }
}
```

### `regexSort(list, patterns[, key])`
Sort an array of strings using regex patterns.

#### Params

- **Array** `list`: An array of objects.
- **Array** `patterns`: An array of regular expressions used in sorting. A wildcard (`'*'`) can be used to negate all other regular expressions.
- **Function** `key` (optional): A function to be called on each list element prior to making comparisons.

#### Return
- **Array** A new array containing the sorted elements.
