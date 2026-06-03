[
  (comment_line)
  (comment_block)
] @comment @spell

[
  "lexer"
  "parser"
  "grammar"
  "options"
  "tokens"
  "channels"
  "mode"
  "locals"
] @keyword

"import" @keyword.import

"returns" @keyword.return

[
  "public"
  "private"
  "protected"
  "fragment"
] @keyword.modifier

[
  "catch"
  "finally"
  "throws"
] @keyword.exception

"EOF" @constant.builtin

(literal_string) @string

(string_escape_sequence) @string.escape

(lexer_char_set) @string.regexp

(literal_int) @number

(token_ref) @constant

(rule_ref) @variable

[
  "|"
  "+"
  "*"
  "?"
  "~"
] @operator

[
  "="
  "->"
  "::"
] @punctuation

[
  "{"
  "}"
  "("
  ")"
] @punctuation.braket

[
  ";"
  ":"
  ","
] @punctuation.delimiter

(labeled_alt
  "#" @attribute
  (identifier
    (_) @attribute))

(labeled_element
  (identifier
    (_) @attribute))

(lexer_command_name
  (identifier
    (_) @function))

(action
  "@" @keyword.directive
  (action_scope_name) @keyword.directive
  (identifier) @keyword.directive)

[
  "<"
  ">"
] @attribute

(option
  name: (identifier
    _ @property))

(element_option
  name: (identifier
    _ @property))

(predicate_option
  name: (identifier
    _ @property))
